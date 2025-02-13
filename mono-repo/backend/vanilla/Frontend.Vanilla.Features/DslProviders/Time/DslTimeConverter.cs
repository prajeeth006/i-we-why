using System;

namespace Frontend.Vanilla.Features.DslProviders.Time;

/// <summary>
/// Converts .NET DateTime and TimeSpan to DSL time which is UNIX time for easier comparisons.
/// </summary>
internal interface IDslTimeConverter
{
    decimal ToDsl(DateTimeOffset time);
    DateTimeOffset FromDslToTime(decimal dslValue);

    decimal ToDsl(TimeSpan timeSpan);
    TimeSpan FromDslToTimeSpan(decimal dslValue);
}

internal sealed class DslTimeConverter : IDslTimeConverter
{
    // Arbitrary numbers safe for .NET, JavaScript and Unix time, should be same in Angular
    public const int MinYear = 1000;
    public const int MaxYear = 3000;

    public decimal ToDsl(DateTimeOffset time)
        => time.ToUnixTimeSeconds();

    public DateTimeOffset FromDslToTime(decimal dslValue)
        => DateTimeOffset.FromUnixTimeSeconds((long)dslValue);

    public decimal ToDsl(TimeSpan timeSpan)
        => (long)timeSpan.TotalSeconds;

    public TimeSpan FromDslToTimeSpan(decimal dslValue)
        => TimeSpan.FromSeconds((long)dslValue);
}
