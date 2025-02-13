using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;

namespace Frontend.Vanilla.ServiceClients.Services.Manager;

/// <summary>
/// Stores PostLogin values for later usage because there is no other way how to retrieve them from PosAPI.
/// </summary>
internal interface IPostLoginValuesManager
{
    bool StorePostLoginValues(ILoginResult loginResult);
    Task<IReadOnlyDictionary<string, object>> GetPostLoginValuesAsync(ExecutionMode mode);
}

internal class PostLoginValuesManager(ICurrentUserAccessor currentUserAccessor, ILabelIsolatedDistributedCache distributedCache)
    : IPostLoginValuesManager
{
    private string GetCacheKeyForCurrentUser()
    {
        var authTokens = currentUserAccessor.User.GetRequiredPosApiAuthTokens();

        return $"LoginResult-{authTokens.SessionToken}";
    }

    public bool StorePostLoginValues(ILoginResult loginResult)
    {
        var posLoginValues = ConvertPostLoginValues(loginResult);

        if (posLoginValues == null)
            return false;

        var cacheKey = GetCacheKeyForCurrentUser();
        var json = JsonConvert.SerializeObject(posLoginValues);
        distributedCache.SetString(cacheKey, json, new DistributedCacheEntryOptions { SlidingExpiration = TimeSpan.FromMinutes(20) });

        return true;
    }

    public async Task<IReadOnlyDictionary<string, object>> GetPostLoginValuesAsync(ExecutionMode mode)
    {
        var cacheKey = GetCacheKeyForCurrentUser();
        var json = await distributedCache.GetStringAsync(mode, cacheKey);

        return json != null ? JsonConvert.DeserializeObject<IReadOnlyDictionary<string, object>>(json) : null;
    }

    /// <summary>
    /// Normalize keys that are comming from HYD (e.g. NO_OF_HOURS_LEFT), to avoid having identificators in js that look like "nO_OF_HOURS_LEFT"
    /// After normalized keys look like "NoOfHoursLeft" in .NET and "noOfHoursLeft" in Javascript
    /// Values are converted to bool if "true" or "false", left as string otherwise.
    /// </summary>
    private IReadOnlyDictionary<string, object> ConvertPostLoginValues(ILoginResult loginResult)
        => loginResult.PostLoginValues?.ToDictionary(
            /* Key */ pair => string.Concat(
                pair.Key.Split(new[] { "_" }, StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => char.ToUpperInvariant(s[0]) + s.Substring(1).ToLowerInvariant())),
            /* Value */
            pair =>
            {
                if (bool.TryParse(pair.Value, out var b)) return b;

                return pair.Value as object;
            });
}
