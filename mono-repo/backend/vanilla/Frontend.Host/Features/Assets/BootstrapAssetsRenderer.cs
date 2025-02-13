using Frontend.Host.Features.Assets.AssetTypes;
using Frontend.Host.Features.Assets.Renderers;
using Frontend.Vanilla.Core.Collections;
using Microsoft.Extensions.Logging;

namespace Frontend.Host.Features.Assets;

internal interface IBootstrapAssetsRenderer
{
    Task<string> RenderAsync(BootstrapAssetSection section, CancellationToken cancellationToken);
}

internal class BootstrapAssetsRenderer : IBootstrapAssetsRenderer
{
    private readonly IBootstrapAssetsContext bootstrapAssetsContext;
    private readonly IBootstrapAssetsProvider bootstrapAssetsProvider;
    private readonly IReadOnlyDictionary<Type, IBootstrapAssetRenderer> renderers;
    private readonly ILogger<BootstrapAssetsRenderer> log;

    public BootstrapAssetsRenderer(
        IBootstrapAssetsProvider bootstrapAssetsProvider,
        IBootstrapAssetsContext bootstrapAssetsContext,
        IEnumerable<IBootstrapAssetRenderer> renderers,
        ILogger<BootstrapAssetsRenderer> log)
    {
        this.bootstrapAssetsContext = bootstrapAssetsContext;
        this.bootstrapAssetsProvider = bootstrapAssetsProvider;
        this.renderers = renderers.ToDictionary(r => r.AssetType);
        this.log = log;
    }

    public async Task<string> RenderAsync(BootstrapAssetSection section, CancellationToken cancellationToken)
    {
        try
        {
            var assets = await bootstrapAssetsProvider.GetAssets(bootstrapAssetsContext, cancellationToken).ToListAsync(cancellationToken);
            ValidateAssets(assets);

            return string.Concat(assets.Select(a =>
            {
                var renderer = renderers.GetValue(a.GetType()) ?? throw new Exception($"Cannot find renderer for asset type {a.GetType()}");

                return renderer.Render(a, section);
            }));
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Loading Bootstrap assets failed");

            return string.Empty;
        }
    }

    private static void ValidateAssets(IEnumerable<BootstrapAsset> assets)
    {
        if (assets.OfType<ILazyBootstrapAsset>().Any(a => a.LazyLoad == AssetLazyLoadStrategy.Custom && string.IsNullOrEmpty(a.Alias)))
        {
            throw new Exception("Alias is required for a stylesheet/script with lazy load strategy: Custom.");
        }
    }
}
