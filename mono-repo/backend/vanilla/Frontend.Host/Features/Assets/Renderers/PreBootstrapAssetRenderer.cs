using Frontend.Host.Features.Assets.AssetTypes;

namespace Frontend.Host.Features.Assets.Renderers;

internal class PreBootstrapAssetRenderer(IAssetTagRenderer assetTagRenderer) : BootstrapAssetRenderer<PreBootstrapAsset>
{
    protected override bool ShouldRender(BootstrapAssetSection section, PreBootstrapAsset asset)
        => section == BootstrapAssetSection.Head;

    protected override string Render(PreBootstrapAsset asset, BootstrapAssetSection section)
    {
        var relation = asset.Relation.GetValue();
        var attributes = new Dictionary<string, string>
        {
            ["rel"] = relation,
            ["type"] = asset.Type ?? string.Empty,
        };
        if (asset.As != null)
            attributes["as"] = asset.As;

        if (asset.Media != null)
            attributes["media"] = asset.Media;

        if (asset.Onload != null)
            attributes["onload"] = asset.Onload;

        return assetTagRenderer.Link(asset.Path, attributes);
    }
}
