namespace Frontend.Host.Features.Assets.Renderers;

internal interface IBootstrapAssetRenderer
{
    Type AssetType { get; }
    string Render(BootstrapAsset asset, BootstrapAssetSection section);
}

internal abstract class BootstrapAssetRenderer<TAsset> : IBootstrapAssetRenderer
    where TAsset : BootstrapAsset
{
    protected abstract string Render(TAsset asset, BootstrapAssetSection section);

    public Type AssetType => typeof(TAsset);

    protected abstract bool ShouldRender(BootstrapAssetSection section, TAsset asset);

    public string Render(BootstrapAsset asset, BootstrapAssetSection section)
    {
        return asset.Path != null && ShouldRender(section, (TAsset)asset) ? Render((TAsset)asset, section) : string.Empty;
    }
}
