using System.Threading.Tasks;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Features.PlaceholderReplacers;

internal interface IProductPlaceholderReplacer
{
    /// <summary>
    /// Replaces product replacement values (i.e. {portal}) with actual product url (containing language) from sitecore.
    /// </summary>
    /// <returns></returns>
    Task<string> ReplaceAsync(ExecutionMode mode, string input);
}

internal sealed class ProductPlaceholderReplacer(IContentService contentService) : IProductPlaceholderReplacer
{
    public async Task<string> ReplaceAsync(ExecutionMode mode, string input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return input;
        }

        ILinkTemplate? portal;
        if (mode.AsyncCancellationToken != null)
            portal = await contentService.GetAsync<ILinkTemplate>("App-v1.0/Links/HomePortal", mode.AsyncCancellationToken.Value);
        else
            portal = contentService.Get<ILinkTemplate>("App-v1.0/Links/HomePortal");

        return input.Replace("{portal}", portal?.Url?.ToString());
    }
}
