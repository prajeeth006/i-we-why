#nullable enable

using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Documents;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Content.Client.Infrastructure;

/// <summary>
/// Contains helpers for mapping content to client content classes.
/// </summary>
public interface IClientContentContext
{
    /// <summary>Gets the current cancellation token. It's automatically passed to all async methods of this context.</summary>
    CancellationToken CancellationToken { get; }

    /// <summary>Loads content for specified <c>ids</c> and converts them to client classes.</summary>
    Task<MenuItem?> LoadMenuAsync(DocumentId id);

    /// <summary>Loads content for specified <c>ids</c> and converts them to client classes.</summary>
    Task<IReadOnlyList<ClientDocument>> LoadAsync(IEnumerable<DocumentId> ids);

    /// <summary>Loads content for specified <c>id</c> and converts it to client class.</summary>
    Task<ClientDocument?> LoadAsync(DocumentId id);

    /// <summary>Converts content to client class.</summary>
    Task<ClientDocument?> ConvertAsync(IDocument document);

    /// <summary>
    /// Creates a client serializable representation of <see cref="IReadOnlyDictionary{K, V}"/>.
    /// Returns null if the <c>collection</c> itself is null or empty.
    /// </summary>
    ContentParameters? CreateOptionalCollection(ContentParameters? collection);

    /// <summary>
    /// Creates a client serializable representation of <see cref="IReadOnlyDictionary{K, V}"/>.
    /// Returns empty collection if the <c>collection</c> itself is null or empty.
    /// </summary>
    ContentParameters CreateCollection(ContentParameters? collection);

    /// <summary>Normalizes text. Returns null if the <c>text</c> is null or white space.</summary>
    string? CreateText(string? text);

    /// <summary>Creates optional list item collection.</summary>
    IReadOnlyList<ClientListItem> CreateListItemCollection(IReadOnlyList<ListItem> source);
}

internal sealed class ClientContentContext(
    IClientContentService contentService,
    IMenuFactory menuFactory,
    ContentLoadOptions baseOptions,
    CancellationToken cancellationToken)
    : IClientContentContext
{
    public IClientContentService ContentService { get; } = contentService;
    public IMenuFactory MenuFactory { get; } = menuFactory;
    public ContentLoadOptions Options { get; } = new () { DslEvaluation = baseOptions.DslEvaluation, RequireTranslation = baseOptions.RequireTranslation };
    public CancellationToken CancellationToken { get; } = cancellationToken;

    public Task<MenuItem?> LoadMenuAsync(DocumentId id)
        => MenuFactory.GetItemAsync(id, Options.DslEvaluation, CancellationToken);

    public Task<IReadOnlyList<ClientDocument>> LoadAsync(IEnumerable<DocumentId> ids)
        => ContentService.GetAsync(ids, CancellationToken, Options);

    public Task<ClientDocument?> LoadAsync(DocumentId id)
        => ContentService.GetAsync(id, CancellationToken, Options);

    public Task<ClientDocument?> ConvertAsync(IDocument document)
        => ContentService.ConvertAsync(document, CancellationToken, Options);

    public ContentParameters? CreateOptionalCollection(ContentParameters? collection)
        => collection?.Count > 0 ? collection : null;

    public ContentParameters CreateCollection(ContentParameters? collection)
        => collection ?? ContentParameters.Empty;

    public string? CreateText(string? text)
        => text.WhiteSpaceToNull();

    public IReadOnlyList<ClientListItem> CreateListItemCollection(IReadOnlyList<ListItem> source)
        => source.ConvertAll(i => new ClientListItem { Text = i.Text, Value = i.Value });
}
