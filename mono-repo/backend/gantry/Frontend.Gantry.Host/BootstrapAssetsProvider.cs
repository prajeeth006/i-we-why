using System.Runtime.CompilerServices;
using Frontend.Host.Features.Assets;
using Frontend.Host.Features.Assets.AssetTypes;

namespace Frontend.Gantry.Host;

public class BootstrapAssetsProvider: IBootstrapAssetsProvider
{
    public async IAsyncEnumerable<BootstrapAsset> GetAssets(IBootstrapAssetsContext context, [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        foreach (var modulePreloadBootstrapAsset in await context.GetModulePreloadLinksAsync(cancellationToken))
        {
            yield return modulePreloadBootstrapAsset;
        }
        yield return new ScriptBootstrapAsset(await context.WebpackFileAsync("polyfills.js", cancellationToken)) { Module = ScriptBootstrapAssetModule.Module };
        yield return new ScriptBootstrapAsset(await context.WebpackFileAsync("main.js", cancellationToken)) { Module = ScriptBootstrapAssetModule.Module };
    }
}
