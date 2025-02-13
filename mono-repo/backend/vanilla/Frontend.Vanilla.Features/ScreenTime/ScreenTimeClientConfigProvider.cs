using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.ScreenTime;

internal sealed class ScreenTimeClientConfigProvider(IScreenTimeConfiguration screenTimeConfiguration) : LambdaClientConfigProvider("vnScreenTime", () => new
{
    minimumScreenTime = screenTimeConfiguration.MinimumScreenTime.TotalMilliseconds,
    minimumUpdateInterval = screenTimeConfiguration.MinimumUpdateInterval.TotalMilliseconds,
    idleTimeout = screenTimeConfiguration.IdleTimeout.TotalMilliseconds,
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
