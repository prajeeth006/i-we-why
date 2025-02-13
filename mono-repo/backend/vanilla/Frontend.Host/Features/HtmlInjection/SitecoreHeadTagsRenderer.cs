using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features;
using Frontend.Vanilla.Features.HtmlInjection;
using Microsoft.Extensions.Logging;

namespace Frontend.Host.Features.HtmlInjection;

/// <summary>
/// Render HeadTags from sitecore.
/// </summary>
public interface ISitecoreHeadTagsRenderer
{
    /// <summary>
    /// Render HeadTags from sitecore.
    /// </summary>
    /// <returns></returns>
    Task<string> RenderAsync(CancellationToken cancellationToken);
}

internal sealed class SitecoreHeadTagsRenderer(
    IContentService contentService,
    IInternalRequestEvaluator internalRequestEvaluator,
    IHtmlInjectionConfiguration configuration,
    IHtmlInjectionControlOverride htmlInjectionControlOverride,
    ILogger<SitecoreHeadTagsRenderer> log)
    : ISitecoreHeadTagsRenderer
{
    public async Task<string> RenderAsync(CancellationToken cancellationToken)
    {
        if (!configuration.EnableHtmlHeadTagsFromSitecore || htmlInjectionControlOverride.IsDisabled(HtmlInjectionKind.SitecoreHtmlHeadTags))
        {
            return string.Empty;
        }

        try
        {
            var items = await contentService.GetChildrenAsync<IStaticFileTemplate>(AppPlugin.ContentRoot + "/HtmlHeadTags", cancellationToken);
            var headTags = items.Where(c => !string.IsNullOrWhiteSpace(c.Content));
            var tags = new List<string>();

            if (internalRequestEvaluator.IsInternal())
            {
                tags.Add($"<!-- start:Sitecore head tags -->");
            }

            foreach (var item in headTags)
            {
                tags.Add(internalRequestEvaluator.IsInternal()
                    ? $"<!-- item:{item.Metadata.Id.ItemName} {item.Metadata.Id.Id} -->{Environment.NewLine}{item.Content}"
                    : item.Content!);
            }

            if (internalRequestEvaluator.IsInternal())
            {
                tags.Add($"<!-- end:Sitecore head tags -->");
            }

            return tags.Join(Environment.NewLine);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Unable to load HTML head tags from Sitecore");

            return string.Empty;
        }
    }
}
