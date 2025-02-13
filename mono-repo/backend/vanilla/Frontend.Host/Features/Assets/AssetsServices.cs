using Frontend.Host.Features.Assets.Renderers;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.Assets;

internal static class AssetsServices
{
    public static void AddAssetsFeature(this IServiceCollection services)
    {
        services.AddHttpClient();
        services.AddSingleton<IWebpackManifestFileResolver, WebpackManifestFileResolver>();
        services.AddSingleton<IAssetTagRenderer, AssetTagRenderer>();
        services.AddSingleton<IBootstrapAssetsRenderer, BootstrapAssetsRenderer>();
        services.AddSingleton<IBootstrapAssetsContext, BootstrapAssetsContext>();
        services.AddSingleton<ILazyAssetsConfigProvider, LazyAssetsConfigProvider>();

        // renderers
        services.AddSingleton<IBootstrapAssetRenderer, ScriptBootstrapAssetRenderer>();
        services.AddSingleton<IBootstrapAssetRenderer, StylesheetBootstrapAssetRenderer>();
        services.AddSingleton<IBootstrapAssetRenderer, InlineStylesheetBootstrapAssetRenderer>();
        services.AddSingleton<IBootstrapAssetRenderer, PreBootstrapAssetRenderer>();
        services.AddSingleton<IBootstrapAssetRenderer, ModulePreloadBootstrapAssetRenderer>();
    }
}
