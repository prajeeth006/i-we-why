using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Clock;

internal sealed class ClockClientConfigProvider(IClockConfiguration config) : LambdaClientConfigProvider("vnClock", () => new { config.SlotName, config.DateTimeFormat, config.UseWithTimeZone })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
