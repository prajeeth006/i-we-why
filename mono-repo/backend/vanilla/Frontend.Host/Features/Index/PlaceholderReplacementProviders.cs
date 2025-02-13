using Frontend.Host.Features.Assets;
using Frontend.Host.Features.HtmlInjection;
using Frontend.Vanilla.Core.Collections;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Http;

namespace Frontend.Host.Features.Index;

internal sealed class HtmlClassPlaceholderReplacementProvider(IIndexViewDataProvider indexViewDataProvider) : IIndexPlaceholderReplacementProvider
{
    private const string Placeholder = "<!-- @HTML-CLASS -->";

    public Task<(string, string)> GetPlaceholderWithReplacementAsync(HttpContext httpContext)
        => Task.FromResult((Placeholder, $"vn-{indexViewDataProvider.MajorVersion}"));
}

internal sealed class HtmlLangPlaceholderReplacementProvider(IIndexViewDataProvider indexViewDataProvider) : IIndexPlaceholderReplacementProvider
{
    private const string Placeholder = "<!-- @HTML-LANG -->";

    public Task<(string, string)> GetPlaceholderWithReplacementAsync(HttpContext httpContext)
        => Task.FromResult((Placeholder, indexViewDataProvider.GetHtmlLang()));
}

internal sealed class HeadPlaceholderReplacementProvider(IIndexViewDataProvider indexViewDataProvider) : IIndexPlaceholderReplacementProvider
{
    private const string Placeholder = "<!-- @HEAD -->";

    public async Task<(string, string)> GetPlaceholderWithReplacementAsync(HttpContext httpContext)
    {
        var titleTask = indexViewDataProvider.GetTitleAsync(httpContext);
        var clientConfigTask = indexViewDataProvider.RenderClientConfigScriptAsync(httpContext);
        var headTagsFromSitecoreTask =
            indexViewDataProvider.RenderHtmlHeadTagsFromSitecoreAsync(httpContext.RequestAborted);
        var headTagsFromDynaconTask =
            indexViewDataProvider.RenderHtmlHeadTagsFromDynaconAsync(httpContext.RequestAborted);
        var webAppMetadataTask = indexViewDataProvider.RenderWebAppMetadataAsync(httpContext.RequestAborted);
        var headBootstrapAssetsTask = indexViewDataProvider.RenderBootstrapAssetsAsync(BootstrapAssetSection.Head, httpContext.RequestAborted);
        var siteScriptsTopTask = indexViewDataProvider.RenderSiteScriptsAsync(SiteScriptsPosition.Top, httpContext.RequestAborted);

        var title = await titleTask;
        var clientConfig = await clientConfigTask;
        var headTagsFromSitecore = await headTagsFromSitecoreTask;
        var headTagsFromDynacon = await headTagsFromDynaconTask;
        var webAppMetadata = await webAppMetadataTask;
        var headBootstrapAssets = await headBootstrapAssetsTask;
        var siteScriptsTop = await siteScriptsTopTask;

        return (Placeholder, GetReplacement(httpContext, title, clientConfig, headTagsFromSitecore, headTagsFromDynacon, webAppMetadata, headBootstrapAssets, siteScriptsTop));
    }

    private string GetReplacement(HttpContext httpContext, string title, HtmlString clientConfig, HtmlString headTagsFromSitecore, HtmlString headTagsFromDynacon, HtmlString webAppMetadata, HtmlString headBootstrapAssets, HtmlString siteScriptsTop)
        => $$"""
             <title>{{title}}</title>
             <meta name="apple-mobile-web-app-title" content="{{title}}" />
             <meta name="description" content="{{indexViewDataProvider.Description}}" />
             <script>
                 {{indexViewDataProvider.RenderCurrentVersion()}}
                 {{clientConfig}}
             </script>
             {{headTagsFromSitecore}}
             {{headTagsFromDynacon}}
             {{indexViewDataProvider.RenderAbTestingScript()}}
             {{webAppMetadata}}
             {{indexViewDataProvider.RenderCanonicalLinkTag(httpContext)}}
             {{headBootstrapAssets}}
             {{siteScriptsTop}}
             {{indexViewDataProvider.RenderPartyTownScripts()}}
             """;
}

public interface IBodyBeforeVnAppPlaceholderResident
{
    Task<string> GetAsync();
}

internal sealed class BodyBeforeVnAppPlaceholderReplacementProvider(IIndexViewDataProvider indexViewDataProvider) : IIndexPlaceholderReplacementProvider
{
    private const string Placeholder = "<!-- @BODY-BEFORE-VN-APP -->";

    public async Task<(string, string)> GetPlaceholderWithReplacementAsync(HttpContext httpContext)
    {
        var splashScreenTask = indexViewDataProvider.RenderSplashScreenAsync(httpContext.RequestAborted);
        var fontPreloadTask = indexViewDataProvider.RenderFontPreloadAsync(httpContext.RequestAborted);
        var splashScreen = await splashScreenTask;
        var fontPreload = await fontPreloadTask;

        var replacement = $"""
                {splashScreen}
                {fontPreload}
                {indexViewDataProvider.RenderDataLayer()}
                {indexViewDataProvider.RenderTagManagers()}
                """;

        return (Placeholder, replacement);
    }
}

internal sealed class BodyAfterVnAppPlaceholderReplacementProvider(IIndexViewDataProvider indexViewDataProvider) : IIndexPlaceholderReplacementProvider
{
    private const string Placeholder = "<!-- @BODY-AFTER-VN-APP -->";

    public async Task<(string, string)> GetPlaceholderWithReplacementAsync(HttpContext httpContext)
    {
        var noScriptTask = indexViewDataProvider.GetRequiredJavaScriptMessageAsync(httpContext.RequestAborted);
        var preloaderTask = indexViewDataProvider.RenderPreloaderAsync(httpContext.RequestAborted);
        var bodyBootstrapAssetsTask = indexViewDataProvider.RenderBootstrapAssetsAsync(BootstrapAssetSection.Body, httpContext.RequestAborted);
        var siteScriptsBottomTask = indexViewDataProvider.RenderSiteScriptsAsync(SiteScriptsPosition.Bottom, httpContext.RequestAborted);
        var delayedScriptTagsTask = indexViewDataProvider.RenderDelayedScriptTagsAsync(httpContext.RequestAborted);

        var noScript = await noScriptTask;
        var preloader = await preloaderTask;
        var bodyBootstrapAssets = await bodyBootstrapAssetsTask;
        var siteScriptsBottom = await siteScriptsBottomTask;
        var delayedScriptTags = await delayedScriptTagsTask;

        var replacement = $"""
                           <noscript>{noScript}</noscript>
                           {preloader}
                           {bodyBootstrapAssets}
                           {siteScriptsBottom}
                           {delayedScriptTags}
                           {indexViewDataProvider.RenderCurrentTime()}
                           """;

        return (Placeholder, replacement);
    }
}
