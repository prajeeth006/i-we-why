using Frontend.Vanilla.Caching.Hekaton.DataLayer;
using Frontend.Vanilla.Core;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.DependencyInjection;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Caching.Hekaton;

/// <summary>
/// Services of Vanilla Hekaton distributed cache.
/// </summary>
public static class HekatonServices
{
    /// <summary>
    /// Adds Vanilla Hekaton distributed cache.
    /// Also adds dependency <see cref="VanillaCoreServices.AddVanillaCore" />.
    /// </summary>
    public static IServiceCollection AddVanillaHekatonDistributedCache(this IServiceCollection services)
    {
        if (!services.TryMarkAsLoaded("Vanilla.Caching.Distributed.Hekaton"))
            return services;

        if (Core.Caching.DistributedCacheExtensions.Current != DistributedCacheType.Hekaton)
        {
            return services;
        }

        // Dependencies
        services.AddVanillaCore();

        // Hekaton
        services.AddSingleton<IHekatonConfiguration>(sp =>
        {
            var config = sp.GetRequiredService<IConfiguration>();
            return new HekatonConfiguration(config);
        });

        services.AddSingleton<IDistributedCache, HekatonDistributedCache>();
        services.AddSingleton<IHekatonDataLayer, HekatonDataLayer>();
        services.AddSingleton<ICacheExpirationCalculator, CacheExpirationCalculator>();

        return services;
    }
}
