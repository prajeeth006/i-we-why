#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Content.Client;

/// <summary>
/// A service that provides content that is processed to be easily serializable for the client.
/// </summary>
public interface IClientContentService
{
    /// <summary>
    /// Gets a content document and converts it to client side POCO class.
    /// Uses <see cref="IContentService.Get{TDocument}(DocumentId,ContentLoadOptions)" /> method to get the base content.
    /// </summary>
    Task<ClientDocument?> GetAsync(DocumentId id, CancellationToken cancellationToken, ContentLoadOptions options = default);

    /// <summary>
    /// Gets a collection of child content documents and converts them to client side POCO classes.
    /// Uses <see cref="IContentService.GetChildren{TDocument}(DocumentId,ContentLoadOptions)" /> method to get the base content.
    /// </summary>
    Task<IReadOnlyList<ClientDocument>> GetChildrenAsync(DocumentId parentId, CancellationToken cancellationToken, ContentLoadOptions options = default);

    /// <summary>
    /// Gets a collection of content documents and converts them to client side POCO classes.
    /// Uses <see cref="IContentService.Get{TDocument}(IEnumerable{DocumentId}, ContentLoadOptions)" /> method to get the base content.
    /// </summary>
    Task<IReadOnlyList<ClientDocument>> GetAsync(IEnumerable<DocumentId> ids, CancellationToken cancellationToken, ContentLoadOptions options = default);

    /// <summary>
    /// Executes conversion to a client POCO class on an existing <see cref="IDocument"/>.
    /// In case of an error it either throws exception or logs it and returns null.
    /// </summary>
    Task<ClientDocument?> ConvertAsync(IDocument? document, CancellationToken cancellationToken, ContentLoadOptions options = default);
}

internal sealed class ClientContentService : IClientContentService
{
    private readonly IContentService contentService;
    private readonly IMenuFactory menuFactory;
    private readonly IReadOnlyList<ClientContentMapping> mappings;
    private readonly ILogger log;

    public ClientContentService(IContentService contentService, IMenuFactory menuFactory, IEnumerable<ClientContentMapping> mappings, ILogger log)
    {
        this.contentService = contentService;
        this.menuFactory = menuFactory;
        this.mappings = Guard.NotEmptyNorNullItems(mappings?.ToList(), nameof(mappings));
        this.log = log;

        var creationMappings = this.mappings.Where(m => m.CreateClientDocument != null).ToList();

        foreach (var mapping1 in creationMappings)
        foreach (var mapping2 in creationMappings.Except(mapping1))
            if (mapping1.SourceType.IsAssignableFrom(mapping2.SourceType))
                throw new Exception(
                    "Only a single IClientContentMapper of those marked as final to create an instance of target type can match source document based on its type"
                    + $" but source types of these are assignable to each other: {mapping1.SourceType} of {mapping1.MapperType} vs {mapping2.SourceType} of {mapping2.MapperType}.");

        foreach (var creation in creationMappings)
        foreach (var mapping in this.mappings.Except(creation))
            if (mapping.SourceType.IsAssignableFrom(creation.SourceType) && !mapping.TargetType.IsAssignableFrom(creation.TargetType))
                throw new Exception($"{mapping.MapperType} maps {mapping.SourceType} (including {creation.SourceType}) to {mapping.TargetType}"
                                    + $" which is incompatible with actual instance {creation.TargetType} created by {creation.MapperType}.");
    }

    public async Task<ClientDocument?> GetAsync(DocumentId id, CancellationToken cancellationToken, ContentLoadOptions options)
    {
        var document = await contentService.GetAsync<IDocument>(id, cancellationToken, options);

        return await ConvertAsync(document, cancellationToken, options);
    }

    public Task<IReadOnlyList<ClientDocument>> GetChildrenAsync(DocumentId parentId, CancellationToken cancellationToken, ContentLoadOptions options)
        => ConvertAllAsync(contentService.GetChildrenAsync<IDocument>(parentId, cancellationToken, options), cancellationToken, options);

    public Task<IReadOnlyList<ClientDocument>> GetAsync(IEnumerable<DocumentId> ids, CancellationToken cancellationToken, ContentLoadOptions options)
        => ConvertAllAsync(contentService.GetAsync<IDocument>(ids, cancellationToken, options), cancellationToken, options);

    private async Task<IReadOnlyList<ClientDocument>> ConvertAllAsync(
        Task<IReadOnlyList<IDocument>> documentsTask,
        CancellationToken cancellationToken,
        ContentLoadOptions options)
    {
        var documents = await documentsTask;
        var clientDocuments = await Task.WhenAll(documents.ConvertAll(d => ConvertAsync(d, cancellationToken, options)));

        return clientDocuments.WhereNotNull().ToList();
    }

    public Task<ClientDocument?> ConvertAsync(IDocument? document, CancellationToken cancellationToken, ContentLoadOptions options)
    {
        if (document == null)
            return DefaultResultTask<ClientDocument?>.Value;

        var creationMappings = mappings.Where(m => m.CreateClientDocument != null && m.SourceType.IsInstanceOfType(document)).ToList();

        if (creationMappings.Count != 1)
            throw new Exception($"There must be a single matching mapper for {document.GetType()} that can create an instance"
                                + $" but there are: {creationMappings.Select(m => m.MapperType).Dump()}.");

        var clientDocument = creationMappings[0].CreateClientDocument!();

        return MapAsync(document, clientDocument, cancellationToken, options);
    }

    private async Task<ClientDocument?> MapAsync(IDocument source, ClientDocument target, CancellationToken cancellationToken, ContentLoadOptions options)
    {
        try
        {
            var context = new ClientContentContext(this, menuFactory, options, cancellationToken);
            await Task.WhenAll(
                mappings
                    .Where(m => m.SourceType.IsInstanceOfType(source))
                    .Select(m => m.MapAsync(source, target, context)));

            return target;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed mapping content {sourceId} of {sourceType} to client-side {targetType}", source.Metadata.Id, source.GetType(), target.GetType());

            return null;
        }
    }
}
