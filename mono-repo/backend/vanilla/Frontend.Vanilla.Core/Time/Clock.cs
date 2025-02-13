using System;
using System.Diagnostics;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Core.Time;

/// <summary>
/// Convenient way how to get current system time and user-local timezone offset and be able to mock it.
/// </summary>
public interface IClock
{
    /// <summary>Gets current system time in UTC.</summary>
    UtcDateTime UtcNow { get; }

    /// <summary>Gets <see cref="UtcNow" /> converted to current user's timezone offset <see cref="DateTimeOffset"/>.</summary>
    DateTimeOffset UserLocalNow { get; }

    /// <summary>Gets the number of milliseconds that have elapsed since 1970-01-01 UTC.</summary>
    long UnixTimeMilliseconds { get; }

    /// <summary>Starts a new stopwatch and returns func which gets elapsed time.</summary>
    Func<TimeSpan> StartNewStopwatch();
}

internal sealed class Clock(IUserTimeTransformer userTimeTransformer) : IClock
{
    public UtcDateTime UtcNow
        => new UtcDateTime(DateTime.UtcNow);

    public DateTimeOffset UserLocalNow
        => userTimeTransformer.ToUserDateTimeOffset(UtcNow);

    public long UnixTimeMilliseconds
        => DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

    public Func<TimeSpan> StartNewStopwatch()
    {
        var start = Stopwatch.GetTimestamp();

        return () => Stopwatch.GetElapsedTime(start);
    }
}

internal interface IUserTimeTransformer
{
    DateTimeOffset ToUserDateTimeOffset(UtcDateTime time);
}

internal sealed class SystemTimeZoneTransformer : IUserTimeTransformer
{
    public DateTimeOffset ToUserDateTimeOffset(UtcDateTime time)
        => time.ConvertTo(TimeZoneInfo.Local);
}
