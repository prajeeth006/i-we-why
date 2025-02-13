using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.PlaceholderReplacers;

namespace Frontend.Vanilla.Features.AccountUpgrade;

internal sealed class AccountUpgradeClientConfigProvider(IAccountUpgradeConfiguration config, IProductPlaceholderReplacer productPlaceholderReplacer)
    : LambdaClientConfigProvider("vnAccountUpgrade",
        async ct => new
        {
            config.AllowedUrls,
            redirectUrl = await productPlaceholderReplacer.ReplaceAsync(ExecutionMode.Async(ct), config.RedirectUrl),
        })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
