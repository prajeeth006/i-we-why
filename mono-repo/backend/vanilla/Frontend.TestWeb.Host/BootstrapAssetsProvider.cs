using System.Runtime.CompilerServices;
using Frontend.Host.Features.Assets;
using Frontend.Host.Features.Assets.AssetTypes;
using Frontend.Host.Features.ClientApp;
using Frontend.Host.Features.Index;

namespace Frontend.TestWeb.Host;

public class BootstrapAssetsProvider : IBootstrapAssetsProvider
{
    public async IAsyncEnumerable<BootstrapAsset> GetAssets(IBootstrapAssetsContext context, [EnumeratorCancellation]CancellationToken cancellationToken)
    {
        foreach (var modulePreloadBootstrapAsset in await context.GetModulePreloadLinksAsync(cancellationToken))
        {
            yield return modulePreloadBootstrapAsset;
        }
        yield return new InlineStylesheetBootstrapAsset(await context.WebpackFileContentAsync($"{context.Theme}/themes-{context.Theme}-root.css", cancellationToken));
        yield return new InlineStylesheetBootstrapAsset(await context.WebpackFileContentAsync($"{context.Theme}/themes-{context.Theme}-splash-loader.css", cancellationToken));
        yield return new StylesheetBootstrapAsset(await context.WebpackFileAsync($"themes-{context.Theme}-main.css", cancellationToken))
            { LazyLoad = AssetLazyLoadStrategy.Important };
        yield return new StylesheetBootstrapAsset(await context.WebpackFileAsync($"{context.Theme}/themes-{context.Theme}-theme-v2-split-media.css", cancellationToken))
            { LazyLoad = AssetLazyLoadStrategy.Important };
        yield return new StylesheetBootstrapAsset(
                await context.WebpackFileAsync($"{context.Theme}/media/themes-{context.Theme}-theme-v2-split-media-max-width-599-98.css", cancellationToken))
            { LazyLoad = AssetLazyLoadStrategy.Important, Media = "lt-sm" };
        yield return new StylesheetBootstrapAsset(
                await context.WebpackFileAsync($"{context.Theme}/media/themes-{context.Theme}-theme-v2-split-media-min-width-600.css", cancellationToken))
            { LazyLoad = AssetLazyLoadStrategy.Important, Media = "gt-xs" };
        yield return new StylesheetBootstrapAsset(
                await context.WebpackFileAsync($"{context.Theme}/media/themes-{context.Theme}-theme-v2-split-media-min-width-960.css", cancellationToken))
            { LazyLoad = AssetLazyLoadStrategy.Important, Media = "gt-sm" };
        yield return new StylesheetBootstrapAsset(
                await context.WebpackFileAsync($"{context.Theme}/media/themes-{context.Theme}-theme-v2-split-media-min-width-1280.css", cancellationToken))
            { LazyLoad = AssetLazyLoadStrategy.Important, Media = "gt-md" };
        yield return new StylesheetBootstrapAsset(
                await context.WebpackFileAsync($"{context.Theme}/media/themes-{context.Theme}-theme-v2-split-media-min-width-1600.css", cancellationToken))
            { LazyLoad = AssetLazyLoadStrategy.Important, Media = "gt-mw" };
        yield return new StylesheetBootstrapAsset(
                await context.WebpackFileAsync($"{context.Theme}/media/themes-{context.Theme}-theme-v2-split-media-min-width-1920.css", cancellationToken))
            { LazyLoad = AssetLazyLoadStrategy.Important, Media = "gt-lg" };
        yield return new StylesheetBootstrapAsset(await context.WebpackFileAsync($"{context.Theme}/themes-{context.Theme}-belowthefold.css", cancellationToken))
            { LazyLoad = AssetLazyLoadStrategy.Secondary };

        if (context.IndexHtmlMode == IndexHtmlMode.RazorIndexView)
        {
            yield return new ScriptBootstrapAsset(await context.WebpackFileAsync("polyfills.js", cancellationToken))
                { Module = ScriptBootstrapAssetModule.Module };
            yield return new ScriptBootstrapAsset(await context.WebpackFileAsync("main.js", cancellationToken))
                { Module = ScriptBootstrapAssetModule.Module };
        }

        yield return new ScriptBootstrapAsset(context.LocaleFile()!)
            { Module = ScriptBootstrapAssetModule.Module };

        if (context.Mode == ClientAppMode.DevServer)
        {
            yield return new StylesheetBootstrapAsset(await context.WebpackFileAsync($"{context.Theme}/themes-{context.Theme}-root.css", cancellationToken));
            yield return new StylesheetBootstrapAsset(await context.WebpackFileAsync($"{context.Theme}/themes-{context.Theme}-splash-loader.css", cancellationToken));
        }
    }
}
