using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.PlaceholderReplacers;

namespace Frontend.Vanilla.Features.ConfirmPassword;

internal sealed class ConfirmPasswordClientConfigProvider(IConfirmPasswordConfiguration config, IProductPlaceholderReplacer productPlaceholderReplacer)
    : LambdaClientConfigProvider("vnConfirmPassword", async (ct) =>
    {
        if (!config.IsEnabled)
            return new { IsEnabled = false };

        return new
        {
            config.IsEnabled,
            redirectUrl = await productPlaceholderReplacer.ReplaceAsync(ExecutionMode.Async(ct), config.RedirectUrl),
        };
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
