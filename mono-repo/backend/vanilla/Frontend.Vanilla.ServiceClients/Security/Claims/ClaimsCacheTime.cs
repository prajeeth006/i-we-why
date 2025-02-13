#nullable enable

using System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Security.Claims;

/// <summary>
/// Defines how long should be claims cache. It should be in sync with user authentication expiration e.g. on web layer.
/// </summary>
internal interface IClaimsCacheTime
{
    TimeSpan Value { get; }
    TimeSpan AnonymousClaimCacheTime { get; }
}

internal sealed class ClaimsCacheTime(IServiceClientsConfiguration config) : IClaimsCacheTime
{
    public TimeSpan Value => config.UserDataCacheTime;
    public TimeSpan AnonymousClaimCacheTime => config.UserDataCacheTime;
}
