using Bwin.Vanilla.Features.Assets;
using Bwin.Vanilla.Features.Assets.AssetTypes;
using System.Collections.Generic;

namespace Frontend.Gantry.Shared
{
    public class BootstrapAssetsProvider: IBootstrapAssetsProvider
    {
        public IEnumerable<BootstrapAsset> GetAssets(IBootstrapAssetsContext context)
        {
            if (context.IsWebpackDevServerUsed)
            {
                yield return new ScriptBootstrapAsset(context.WebpackFile("main.js"));
                yield return new ScriptBootstrapAsset(context.WebpackFile("polyfills.js"));
                yield return new ScriptBootstrapAsset(context.WebpackFile("vendor.js"));
                yield return new ScriptBootstrapAsset(context.WebpackFile("runtime.js"));
                //yield return new ScriptBootstrapAsset(context.LocaleFile());
            }
            else
            {

                yield return new ScriptBootstrapAsset(context.WebpackFile("runtime.js")) { Module = ScriptBootstrapAssetModule.Module };
                yield return new ScriptBootstrapAsset(context.WebpackFile("polyfills.js")) { Module = ScriptBootstrapAssetModule.Module };
                yield return new ScriptBootstrapAsset(context.WebpackFile("vendor.js")) { Module = ScriptBootstrapAssetModule.Module };
                yield return new ScriptBootstrapAsset(context.WebpackFile("main.js")) { Module = ScriptBootstrapAssetModule.Module };
            }
        }
    }
}