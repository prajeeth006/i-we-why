using System.Text;
using Frontend.Host.Features.Assets.AssetTypes;

namespace Frontend.Host.Features.Assets.Renderers;

internal class ScriptBootstrapAssetRenderer(IAssetTagRenderer assetTagRenderer) : BootstrapAssetRenderer<ScriptBootstrapAsset>
{
    protected override bool ShouldRender(BootstrapAssetSection section, ScriptBootstrapAsset asset)
        => (section == BootstrapAssetSection.Head && asset.IsHeadScript) || (section == BootstrapAssetSection.Body && !asset.IsHeadScript);

    protected override string Render(ScriptBootstrapAsset asset, BootstrapAssetSection section)
    {
        var attrs = new Dictionary<string, string>();

        if (asset.LazyLoad == AssetLazyLoadStrategy.None)
        {
            switch (asset.Module)
            {
                case ScriptBootstrapAssetModule.Module:
                    attrs["type"] = "module";

                    break;
                case ScriptBootstrapAssetModule.NoModule:
                    attrs["nomodule"] = "";
                    attrs["defer"] = "";

                    break;
            }
        }

        return assetTagRenderer.Script(asset.Path, attrs);
    }
}
