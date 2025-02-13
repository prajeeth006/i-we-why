using Frontend.Host.Features.Assets.AssetTypes;

namespace Frontend.Host.Features.Assets.Renderers;

internal class ModulePreloadBootstrapAssetRenderer(IAssetTagRenderer assetTagRenderer) : BootstrapAssetRenderer<ModulePreloadBootstrapAsset>
{
    protected override bool ShouldRender(BootstrapAssetSection section, ModulePreloadBootstrapAsset asset)
        => section == BootstrapAssetSection.Head;

    protected override string Render(ModulePreloadBootstrapAsset asset, BootstrapAssetSection section)
    {
        var attributes = new Dictionary<string, string>
        {
            ["rel"] = "modulepreload",
            ["type"] = string.Empty,
        };

        return assetTagRenderer.Link(asset.Path, attributes);
    }
}
