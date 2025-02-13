#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Claims;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Frontend.Vanilla.ServiceClients.Security.Claims;

/// <summary>
/// Cache for user claims. Shared within the label -> distributed cache.
/// </summary>
internal interface IClaimsCache
{
    Task<IReadOnlyList<Claim>?> GetAsync(ExecutionMode mode, PosApiAuthTokens? authTokens);
    Task SetAsync(ExecutionMode mode, IEnumerable<Claim> claims);
    Task RemoveAsync(ExecutionMode mode, PosApiAuthTokens? authTokens);
}

internal sealed class ClaimsCache(
    ILabelIsolatedDistributedCache distributedCache,
    IClientIPResolver clientIpResolver,
    IClaimsCacheTime cacheTime,
    ILogger<ClaimsCache> log)
    : IClaimsCache
{
    private readonly IDistributedCache distributedCache = distributedCache.IsolateBy(keyPrefix: "Van:PosApi:Claims:");

    public async Task<IReadOnlyList<Claim>?> GetAsync(ExecutionMode mode, PosApiAuthTokens? authTokens)
    {
        var cacheKey = GetCacheKey(authTokens);

        try
        {
            var json = await distributedCache.GetStringAsync(mode, cacheKey);

            if (json == null) return null;

            var dto = JsonConvert.DeserializeObject<List<ClaimDto>>(json);
            Guard.Assert(dto?.Count > 0);

            return dto.ConvertAll(d => new Claim(d.Type, d.Value, d.ValueType, d.Issuer, d.OriginalIssuer));
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed to get claims from cache with {cacheKey}", cacheKey);

            return null;
        }
    }

    public async Task SetAsync(ExecutionMode mode, IEnumerable<Claim> claims)
    {
        var claimList = claims.Enumerate();
        var userToken = claimList.FirstOrDefault(c => c.Type.Equals(PosApiClaimTypes.UserToken, StringComparison.OrdinalIgnoreCase))?.Value;
        var sessionToken = claimList.FirstOrDefault(c => c.Type.Equals(PosApiClaimTypes.SessionToken, StringComparison.OrdinalIgnoreCase))?.Value;
        var posApiAuthTokens = PosApiAuthTokens.TryCreate(userToken, sessionToken);
        var cacheKey = GetCacheKey(posApiAuthTokens);

        try
        {
            var json = JsonConvert.SerializeObject(claimList.ConvertAll(d => new ClaimDto(d.Type, d.Value, d.ValueType, d.Issuer, d.OriginalIssuer)));
            await distributedCache.SetStringAsync(mode, cacheKey, json, new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = posApiAuthTokens == null ? cacheTime.AnonymousClaimCacheTime : cacheTime.Value });
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed to set claims to cache with {cacheKey}", cacheKey);
        }
    }

    public async Task RemoveAsync(ExecutionMode mode, PosApiAuthTokens? authTokens)
    {
        var cacheKey = GetCacheKey(authTokens);

        try
        {
            await distributedCache.RemoveAsync(mode, cacheKey);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed to remove claims from cache with {cacheKey}", cacheKey);
        }
    }

    private string GetCacheKey(PosApiAuthTokens? authTokens)
    {
        if (authTokens != null)
            return $"User:{authTokens.SessionToken}";

        var clientIp = clientIpResolver.Resolve();

        return $"Anonymous:{clientIp}";
    }

    internal class ClaimDto(string type, string value, string valueType, string issuer, string originalIssuer)
    {
        public string Type { get; } = type;
        public string Value { get; } = value;
        public string ValueType { get; } = valueType;
        public string Issuer { get; } = issuer;
        public string OriginalIssuer { get; } = originalIssuer;
    }
}
