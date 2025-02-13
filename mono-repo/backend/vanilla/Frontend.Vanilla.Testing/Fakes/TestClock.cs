using System;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Microsoft.Extensions.Internal;

#pragma warning disable 1591
namespace Frontend.Vanilla.Testing.Fakes;
public sealed class TestClock : IClock, ISystemClock
{
    public UtcDateTime UtcNow { get; set; } = TestTime.GetRandomUtc();
    public DateTimeOffset UserLocalNow { get; set; } = new DateTimeOffset(TestTime.GetRandom(DateTimeKind.Local));
    public long UnixTimeMilliseconds { get; set; } = RandomGenerator.GetInt32();

    public Func<TimeSpan> StartNewStopwatch()
    {
        var counter = 7;

        return () => TimeSpan.FromSeconds(counter++);
    }

    DateTimeOffset ISystemClock.UtcNow => UtcNow.Value;
}
#pragma warning restore 1591
