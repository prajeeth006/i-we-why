using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.HtmlInjection;
using Microsoft.Extensions.Logging;

namespace Frontend.Host.Features.HtmlInjection;

internal interface IFooterScriptTagsRenderer
{
    Task<string> RenderAsync(CancellationToken cancellationToken);
}

internal sealed class FooterScriptTagsRenderer(
    IHtmlInjectionControlOverride htmlInjectionControlOverride,
    IHtmlInjectionConfiguration config,
    IInternalRequestEvaluator internalRequestEvaluator,
    ICurrentLanguageResolver currentLanguageResolver,
    ILabelIsolatedDistributedCache labelIsolatedDistributedCache,
    IHttpClientFactory httpClientFactory,
    ILogger<HtmlTagsRenderer> htmlTagRenderLogger,
    ILogger<IFooterScriptTagsRenderer> log)
    : HtmlTagsRenderer(htmlInjectionControlOverride,
        internalRequestEvaluator,
        currentLanguageResolver,
        labelIsolatedDistributedCache,
        httpClientFactory,
        htmlTagRenderLogger), IFooterScriptTagsRenderer
{
    public override async Task<string> RenderAsync(CancellationToken cancellationToken)
    {
        try
        {
            var content = await RenderAsync(cancellationToken,
                "v4",
                "dynacon-footer-script-tags",
                SelectWithTags(config.DslHeadTags, FooterTagName));

            return $"{content}";
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Rendering Footer script tags failed");

            return string.Empty;
        }
    }
}
