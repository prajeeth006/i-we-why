using System;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Caching.Hekaton.DataLayer;

/// <summary>
/// Defines final expiration to be set in Hekaton database.
/// </summary>
internal sealed class CacheExpiration
{
    public UtcDateTime? AbsoluteExpiration { get; }
    public TimeSpan? SlidingExpiration { get; }

    private CacheExpiration(UtcDateTime? absoluteExpiration, TimeSpan? slidingExpiration)
    {
        AbsoluteExpiration = absoluteExpiration;
        SlidingExpiration = slidingExpiration;
    }

    public static CacheExpiration CreateAbsolute(UtcDateTime absoluteExpiration)
        => new (absoluteExpiration, null);

    public static CacheExpiration CreateSliding(TimeSpan slidingExpiration)
        => new (null, slidingExpiration);
}
