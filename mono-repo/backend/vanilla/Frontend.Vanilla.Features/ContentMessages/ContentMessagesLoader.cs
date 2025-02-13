#nullable disable

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.ContentMessages;

/// <summary>
/// Loads content messages and converts them to client format.
/// </summary>
public interface IContentMessagesLoader
{
    /// <summary>
    /// Loads messages.
    /// </summary>
    [NotNull, ItemNotNull]
    Task<IReadOnlyList<ClientDocument>> LoadAsync(
        [NotNull] DocumentId folderId,
        [NotNull] TrimmedRequiredString closedCookieKey,
        DslEvaluation dslEvaluation,
        CancellationToken cancellationToken);

    /// <summary>
    /// Loads a dictionary of content item groups.
    /// </summary>
    Task<IReadOnlyDictionary<string, IReadOnlyList<ClientDocument>>> LoadDictionaryAsync([NotNull] DocumentId rootId, CancellationToken cancellationToken);
}

internal sealed class ContentMessagesLoader(
    IContentService contentService,
    IVanillaClientContentService clientService,
    IClosedContentMessagesCookie cookie,
    ILogger<IContentMessagesLoader> log)
    : IContentMessagesLoader
{
    public async Task<IReadOnlyList<ClientDocument>> LoadAsync(
        DocumentId folderId,
        TrimmedRequiredString closedCookieKey,
        DslEvaluation dslEvaluation,
        CancellationToken cancellationToken)
    {
        Guard.NotNull(folderId, nameof(folderId));
        Guard.NotNull(closedCookieKey, nameof(closedCookieKey));

        try
        {
            // 2 b/c there can be PCComponentFolder with children
            var folder = await contentService.GetRequiredAsync<IDocument>(folderId, cancellationToken, new ContentLoadOptions { PrefetchDepth = 2 });

            var closedMessages = cookie.GetValues(closedCookieKey).ToList();
            CleanDeletedMessages(closedMessages, closedCookieKey, folder);

            if (dslEvaluation == DslEvaluation.PartialForClient)
                closedMessages.RemoveAll(m => m.ShowOnNextLogin); // Don't consider these as closed -> will be filtered on client

            var closedNames = closedMessages.Select(m => m.Name.Value).ToHashSet(StringComparer.OrdinalIgnoreCase);
            var messages = await contentService.GetChildrenAsync<IDocument>(folder, cancellationToken, dslEvaluation);
            messages = messages.Where(m => m.Metadata.Version > 0 && !closedNames.Contains(m.Metadata.Id.ItemName))
                .ToList(); // Feature: filter out untranslated (Version 0) without any warning

            var clientMessages = await Task.WhenAll(messages.Select(m => clientService.ConvertAsync(m, cancellationToken, dslEvaluation)));

            return clientMessages
                .Select((m, i) => FilterInvalid(m, messages[i].Metadata.Id))
                .Where(m => m != null)
                .ToList();
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed loading content messages from {folderId} with closed ones with {closedCookieKey}", folderId, closedCookieKey);

            return Array.Empty<ClientDocument>();
        }
    }

    private const string ParameterError = "Error loading content messages under under {id} - {error}";

    public async Task<IReadOnlyDictionary<string, IReadOnlyList<ClientDocument>>> LoadDictionaryAsync(DocumentId rootId, CancellationToken cancellationToken)
    {
        var contents = await contentService.GetChildrenAsync<IGenericListItem>(rootId, cancellationToken);

        var items = await Task.WhenAll(contents.ConvertAll(async c =>
        {
            var closedCookieKey = c.SharedList?.GetValue("closed-cookie-key");
            var dslEvaluationParam = c.SharedList?.GetValue("dsl-evaluation");
            var emptyResult = new { item = c, messages = (IReadOnlyList<ClientDocument>)Array.Empty<ClientDocument>() };

            if (string.IsNullOrWhiteSpace(closedCookieKey))
            {
                log.LogError(ParameterError, c.Metadata.Id, "missing parameter closed-cookie-key");

                return emptyResult;
            }

            if (string.IsNullOrWhiteSpace(dslEvaluationParam))
            {
                log.LogError(ParameterError, c.Metadata.Id, "missing parameter dsl-evaluation");

                return emptyResult;
            }

            DslEvaluation dslEvaluation;

            switch (dslEvaluationParam)
            {
                case "server":
                    dslEvaluation = DslEvaluation.FullOnServer;

                    break;
                case "client":
                    dslEvaluation = DslEvaluation.PartialForClient;

                    break;
                default:
                    log.LogError(ParameterError, c.Metadata.Id, $"invalid dsl-evaluation value {dslEvaluationParam}. Allowed values are: server, client");

                    return emptyResult;
            }

            return new { item = c, messages = await LoadAsync(c.Metadata.Id, closedCookieKey, dslEvaluation, cancellationToken) };
        }));

        return items.ToDictionary(x => x.item.Metadata.Id.ItemName, x => x.messages);
    }

    private void CleanDeletedMessages(List<ClosedMessageInfo> closedInfos, string closedCookieKey, IDocument parentFolder)
    {
        // ChildIds include filtered-out items too
        var allMessageNames = parentFolder.Metadata.ChildIds.Select(i => i.ItemName).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var cleanedCount = closedInfos.RemoveAll(m => !allMessageNames.Contains(m.Name));

        if (cleanedCount > 0)
            cookie.SetValues(closedCookieKey, closedInfos);
    }

    internal static readonly string ConflictingShowOnNext =
        $"Parameters '{ContentMessageParameters.ShowOnNextLogin}' and '{ContentMessageParameters.ShowOnNextSession}' can't be both set to true at the same time.";

    private ClientDocument FilterInvalid(ClientDocument document, DocumentId id)
    {
        try
        {
            switch (document)
            {
                case null:
                    return null;

                case ClientPCBaseComponent message:
                    if (!message.Parameters.IsNullOrEmpty())
                    {
                        // Parse to find error; get bool before if-condition because it may not evaluate both
                        message.Parameters.GetBoolean(ContentMessageParameters.ShowCloseButton);
                        var showOnNextLogin = message.Parameters.GetBoolean(ContentMessageParameters.ShowOnNextLogin);
                        var showOnNextSession = message.Parameters.GetBoolean(ContentMessageParameters.ShowOnNextSession);

                        if (showOnNextLogin && showOnNextSession)
                            throw new Exception(ConflictingShowOnNext);
                    }

                    return document;

                case ClientProxy proxy:
                    var rules = proxy.Rules.ConvertAll(r => new ClientProxyRule
                    {
                        Document = FilterInvalid(r.Document, id),
                        Condition = r.Condition,
                    });

                    return new ClientProxy { Rules = rules };

                default:
                    throw new Exception($"Unsupported content type {document.GetType()}. Only PC components and proxy are supported.");
            }
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Invalid Parameters specified for content message {id} (or its proxy child). It won't be rendered. Fix it in Sitecore", id);

            return null; // Editor is supposed to check it at least once -> it's not rendered -> he will fix the error
        }
    }
}
