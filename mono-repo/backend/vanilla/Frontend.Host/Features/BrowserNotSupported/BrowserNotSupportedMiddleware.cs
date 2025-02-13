using Frontend.Host.Features.Assets;
using Frontend.Host.Features.Assets.AssetTypes;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.EntryWeb.DataLayer;
using Frontend.Vanilla.Features.EntryWeb.DataLayer.TagManagers;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Host.Features.BrowserNotSupported;

internal class BrowserNotSupportedMiddleware(
    RequestDelegate next,
    IEndpointMetadata endpointMetadata,
    IContentService contentService,
    IBootstrapAssetsContext context,
    IBootstrapAssetsProvider assetsProvider,
    ITrackingConfiguration trackingConfig,
    IDataLayerRenderer dataLayerRenderer,
    ITagManager tagManager,
    IDeviceDslProvider deviceDslProvider,
    IBrowserDslProvider browserDslProvider,
    ILogger<BrowserNotSupportedMiddleware> logger)
    : Middleware(next)
{
    public override Task InvokeAsync(HttpContext httpContext)
    {
        return endpointMetadata.Contains<ServesHtmlDocumentAttribute>() ? WriteResponseAsync() : Next(httpContext);

        async Task WriteResponseAsync()
        {
            var content = await contentService.GetAsync<IViewTemplate>("App-v1.0/SupportedBrowsers/Content", httpContext.RequestAborted);

            if (content?.Text == null)
            {
                await Next(httpContext);

                return;
            }

            var mode = ExecutionMode.Async(httpContext.RequestAborted);
            logger.LogWarning(
                "Device details satisfied condition for showing Browser-Not-Supported page ({@isRobot}, {@isMobile}, {@browserName}, {@browserVersion})",
                await deviceDslProvider.IsRobotAsync(mode),
                await deviceDslProvider.IsMobileAsync(mode),
                await browserDslProvider.GetNameAsync(mode),
                await browserDslProvider.GetVersionAsync(mode));

            var assets = await assetsProvider.GetAssets(context, httpContext.RequestAborted).OfType<StylesheetBootstrapAsset>()
                .Where(a => a.LazyLoad is AssetLazyLoadStrategy.None or AssetLazyLoadStrategy.Important)
                .ToListAsync(httpContext.RequestAborted);
            var styles = assets.Select(a => $"<link rel=\"stylesheet\" href=\"{a.Path}\" />").Join(Environment.NewLine);

            var responseHtml = content.Text
                .Replace("@{Vanilla:Styles}", styles)
                .Replace("@{Vanilla:DataLayer}", tagManager.IsEnabled ? dataLayerRenderer.GetDataLayerMarkup() : "")
                .Replace("@{Vanilla:TagManagers}", tagManager.IsEnabled ? tagManager.RenderBootstrapScript() : "")
                .Replace("@{Vanilla:DataLayerName}", trackingConfig.DataLayerName)
                .Replace("@{Vanilla:TrackingEventTimeout}", ((int)trackingConfig.EventCallbackTimeout.TotalMilliseconds).ToString());

            httpContext.Response.Headers[HttpHeaders.CacheControl] = "no-cache";
            await httpContext.WriteResponseAsync(ContentTypes.Html, responseHtml);
        }
    }
}
