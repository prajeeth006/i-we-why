using System;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Caching.Hekaton.DataLayer;

/// <summary>
/// Calculates <see cref="CacheExpiration" />.
/// </summary>
internal interface ICacheExpirationCalculator
{
    CacheExpiration Calculate(DistributedCacheEntryOptions options, string cacheKey);
}

internal sealed class CacheExpirationCalculator(IHekatonConfiguration config, IClock clock, ILogger<CacheExpirationCalculator> log) : ICacheExpirationCalculator
{
    public CacheExpiration Calculate(DistributedCacheEntryOptions options, string cacheKey)
    {
        if (options.AbsoluteExpiration is DateTimeOffset absoluteExpiration)
        {
            WarnIfOutsideBounds(absoluteExpiration - clock.UtcNow.ValueWithOffset, cacheKey);
            WarnIfUseless(options.AbsoluteExpirationRelativeToNow, nameof(options.AbsoluteExpirationRelativeToNow), nameof(options.AbsoluteExpiration), cacheKey);
            WarnIfUseless(options.SlidingExpiration, nameof(options.SlidingExpiration), nameof(options.AbsoluteExpiration), cacheKey);

            return CacheExpiration.CreateAbsolute(new UtcDateTime(absoluteExpiration));
        }

        if (options.AbsoluteExpirationRelativeToNow is TimeSpan relativeExpiration)
        {
            WarnIfOutsideBounds(relativeExpiration, cacheKey);
            WarnIfUseless(options.SlidingExpiration, nameof(options.SlidingExpiration), nameof(options.AbsoluteExpirationRelativeToNow), cacheKey);

            return CacheExpiration.CreateAbsolute(clock.UtcNow + relativeExpiration);
        }

        if (options.SlidingExpiration is TimeSpan slidingExpiration)
        {
            WarnIfOutsideBounds(slidingExpiration, cacheKey);

            return CacheExpiration.CreateSliding(slidingExpiration);
        }

        return CacheExpiration.CreateAbsolute(clock.UtcNow + config.MaxExpirationTime);
    }

    private void WarnIfOutsideBounds(TimeSpan expiration, string cacheKey)
    {
        if (expiration > config.MaxExpirationTime)
            log.LogWarning(
                "Item in HekatonDistributedCache with {key} is specified with {relExpiration} which exceeds configured {maxExpirationTime}. It will be decreased to avoid database overloading."
                + " Decrease the expiration in your code if you don't need to cache it for that long or change the configuration. " + Disclaimer,
                cacheKey,
                expiration,
                config.MaxExpirationTime);
        else if (expiration < config.MinExpirationTime)
            log.LogWarning(
                "Item in HekatonDistributedCache with {key} is specified with {relExpiration} which is below configured {minExpirationTime} because of execution frequency of SQL cleanup job."
                + " Increase the expiration in your code if you are fine with longer caching or adapt SQL job and change the configuration. " + Disclaimer,
                cacheKey,
                expiration,
                config.MinExpirationTime);
    }

    private void WarnIfUseless<T>(T? propertyValue, string propertyName, string activePropertyName, string cacheKey)
        where T : struct
    {
        if (propertyValue != null)
            log.LogWarning(
                "Item in HekatonDistributedCache with {key} has specified {uselessProperty} with {uselessValue} because {activeProperty} is specified and takes precedence."
                + " Don't specify the useless property if not needed or fix your code. " + Disclaimer,
                cacheKey,
                propertyName,
                propertyValue,
                activePropertyName);
    }

    private const string Disclaimer = "This is task for Vanilla team only if it's a cache item managed by Vanilla. There is no user impact.";
}
