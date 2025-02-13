using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.DepositLimits;

internal sealed class DepositLimitsClientConfigProvider(IDepositLimitsConfiguration configuration)
    : LambdaClientConfigProvider("vnDepositLimits", () => new { configuration.LowThresholds })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
