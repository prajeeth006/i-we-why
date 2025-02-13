using Frontend.Host.Features.Assets.AssetTypes;

namespace Frontend.Host.Features.Assets.Renderers;

internal class StylesheetBootstrapAssetRenderer(IAssetTagRenderer assetTagRenderer) : BootstrapAssetRenderer<StylesheetBootstrapAsset>
{
    protected override bool ShouldRender(BootstrapAssetSection section, StylesheetBootstrapAsset asset)
        => section == BootstrapAssetSection.Head;

    protected override string Render(StylesheetBootstrapAsset asset, BootstrapAssetSection section)
    {
        if (asset.LazyLoad == AssetLazyLoadStrategy.Preload)
        {
            return assetTagRenderer.Link(asset.Path, new Dictionary<string, string>
            {
                ["rel"] = "preload",
                ["onload"] = "this.onload=null;this.rel='stylesheet'",
                ["as"] = "style",
            });
        }

        if (asset.LazyLoad != AssetLazyLoadStrategy.None)
        {
            return string.Empty;
        }

        return assetTagRenderer.Link(asset.Path, new Dictionary<string, string> { ["rel"] = "stylesheet" });
    }
}
