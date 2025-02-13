using Frontend.Host.Features.Assets.AssetTypes;

namespace Frontend.Host.Features.Assets.Renderers;

internal class InlineStylesheetBootstrapAssetRenderer(IAssetTagRenderer assetTagRenderer) : BootstrapAssetRenderer<InlineStylesheetBootstrapAsset>
{
    protected override bool ShouldRender(BootstrapAssetSection section, InlineStylesheetBootstrapAsset asset)
        => section == BootstrapAssetSection.Head;

    protected override string Render(InlineStylesheetBootstrapAsset asset, BootstrapAssetSection section)
    {
        return assetTagRenderer.InlineStyle(asset.Content);
    }
}
