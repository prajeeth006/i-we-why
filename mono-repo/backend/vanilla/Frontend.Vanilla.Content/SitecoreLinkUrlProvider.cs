#nullable enable

using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.ContentServiceImpl;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content;

/// <summary>
/// Logic for resolving URLs from links in Sitecore.
/// </summary>
public interface ISitecoreLinkUrlProvider
{
    /// <summary>Resolves the URL of a link at given path in Sitecore.</summary>
    Uri GetUrl(DocumentId linkId);

    /// <summary>Resolves the URL of a link at given path in Sitecore.</summary>
    Task<Uri> GetUrlAsync(DocumentId linkId, CancellationToken cancellationToken);

    /// <summary>Resolves the URL of a link at given path in Sitecore.</summary>
    Task<Uri> GetUrlAsync(ExecutionMode mode, DocumentId linkId);
}

internal abstract class SitecoreLinkUrlProviderBase : ISitecoreLinkUrlProvider
{
    public abstract Task<Uri> GetUrlAsync(ExecutionMode mode, DocumentId linkId);

    Uri ISitecoreLinkUrlProvider.GetUrl(DocumentId linkId)
        => ExecutionMode.ExecuteSync(GetUrlAsync, linkId);

    Task<Uri> ISitecoreLinkUrlProvider.GetUrlAsync(DocumentId linkId, CancellationToken cancellationToken)
        => GetUrlAsync(ExecutionMode.Async(cancellationToken), linkId);
}

internal sealed class SitecoreLinkUrlProvider(IGetDocumentCommand documentCommand) : SitecoreLinkUrlProviderBase
{
    public override async Task<Uri> GetUrlAsync(ExecutionMode mode, DocumentId linkId)
    {
        Guard.NotNull(linkId, nameof(linkId));

        try
        {
            var linkTemplate = await documentCommand.GetRequiredAsync<ILinkTemplate>(mode, linkId, default);
            var resultUrl = linkTemplate.Link?.Url
                            ?? linkTemplate.Url
                            ?? throw new Exception("There is no useful value in Url and Link fields.");

            return resultUrl.IsAbsoluteUri || resultUrl.ToString().StartsWith("/")
                ? resultUrl
                : throw new Exception($"URL from the link must be absolute or root-relative (starts with '/') to be usable for redirects but it is '{resultUrl}'.");
        }
        catch (Exception ex)
        {
            throw new Exception($"Unable to get URL from content link {linkId}.", ex);
        }
    }
}
