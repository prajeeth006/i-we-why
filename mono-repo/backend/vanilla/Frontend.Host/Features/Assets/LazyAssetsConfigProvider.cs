using Frontend.Host.Features.Assets.AssetTypes;

namespace Frontend.Host.Features.Assets;

internal interface ILazyAssetsConfigProvider
{
    Task<List<AssetConfig>> GetConfigAsync<T>(CancellationToken cancellationToken)
        where T : BootstrapAsset, ILazyBootstrapAsset;
}

internal class LazyAssetsConfigProvider(IBootstrapAssetsProvider bootstrapAssetsProvider, IBootstrapAssetsContext bootstrapAssetsContext)
    : ILazyAssetsConfigProvider
{
    public async Task<List<AssetConfig>> GetConfigAsync<T>(CancellationToken cancellationToken)
        where T : BootstrapAsset, ILazyBootstrapAsset
    {
        var allAssets = bootstrapAssetsProvider.GetAssets(bootstrapAssetsContext, cancellationToken);

        return await allAssets
            .OfType<T>()
            .Where(a => a.LazyLoad != AssetLazyLoadStrategy.None && a.LazyLoad != AssetLazyLoadStrategy.Preload)
            .Select(a => new AssetConfig
            {
                Url = a.Path,
                LazyLoad = a.LazyLoad,
                Media = a.Media,
                Alias = a.Alias,
            })
            .ToListAsync(cancellationToken);
    }
}

internal class AssetConfig
{
    public string? Url { get; set; }
    public AssetLazyLoadStrategy LazyLoad { get; set; }
    public string? Alias { get; set; }
    public string? Media { get; set; }
}
