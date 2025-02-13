using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.HtmlInjection;
using Microsoft.Extensions.Logging;

namespace Frontend.Host.Features.HtmlInjection;

internal interface IHeadTagsRenderer
{
    Task<string> RenderAsync(CancellationToken cancellationToken);
}

internal sealed class HeadTagsRenderer(
    IHtmlInjectionControlOverride htmlInjectionControlOverride,
    IHtmlInjectionConfiguration config,
    IInternalRequestEvaluator internalRequestEvaluator,
    ICurrentLanguageResolver currentLanguageResolver,
    ILabelIsolatedDistributedCache labelIsolatedDistributedCache,
    IHttpClientFactory httpClientFactory,
    ILogger<HtmlTagsRenderer> htmlTagRenderLogger,
    ILogger<IHeadTagsRenderer> logger)
    : HtmlTagsRenderer(htmlInjectionControlOverride,
        internalRequestEvaluator,
        currentLanguageResolver,
        labelIsolatedDistributedCache,
        httpClientFactory,
        htmlTagRenderLogger), IHeadTagsRenderer
{
    public override async Task<string> RenderAsync(CancellationToken cancellationToken)
    {
        try
        {
            return await RenderAsync(cancellationToken, "v4", "dynacon-head-tags", SelectWithoutTags(config.DslHeadTags, FooterTagName));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Rendering head tags failed");

            return string.Empty;
        }
    }
}
