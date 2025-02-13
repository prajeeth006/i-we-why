using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;
using Microsoft.Extensions.Caching.Memory;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Diagnostics;

/// <summary>
/// Stores health state of HTTP traffic to PosAPI.
/// </summary>
internal interface ITrafficHealthState
{
    void Set([NotNull] HealthCheckResult state);

    [CanBeNull]
    HealthCheckResult Get();
}

internal sealed class TrafficHealthState(IMemoryCache cache, IServiceClientsConfiguration config) : ITrafficHealthState
{
    private const string CacheKey = "Vanilla:PosApiTrafficHealth";

    public void Set(HealthCheckResult state)
    {
        Guard.NotNull(state, nameof(state));

        cache.Set(CacheKey, state, config.HealthInfoExpiration);
    }

    public HealthCheckResult Get()
    {
        return cache.Get<HealthCheckResult>(CacheKey);
    }
}
