using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;

namespace Frontend.Vanilla.ServiceClients.Services.MyBets.CustomerHasBets;

internal interface ICustomerHasBetsServiceClient
{
    public Task<bool> GetAsync(CancellationToken cancellationToken, bool cached);
}

internal sealed class CustomerHasBetsServiceClient(IPosApiRestClient posApiRestClient, ILabelIsolatedDistributedCache distributedCache, ICurrentUserAccessor currentUserAccessor) : ICustomerHasBetsServiceClient
{
    private PathRelativeUri DataUrl => new UriBuilder()
        .AppendPathSegment("myBets")
        .AppendPathSegment("v1")
        .AppendPathSegment("customer-has-bets")
        .GetRelativeUri();
    private BettingApiRestRequest Request => new (DataUrl)
    {
        Authenticate = true,
    };

    public async Task<bool> GetAsync(CancellationToken cancellationToken, bool cached)
    {
        var cacheKey = GetCacheKey();
        var cachedValue = cached
            ? await distributedCache.GetStringAsync(cacheKey, cancellationToken)
            : null;

        return cachedValue != null ? JsonConvert.DeserializeObject<bool>(cachedValue) : await ExecuteFreshAsync(cacheKey, cancellationToken);
    }

    private async Task<bool> ExecuteFreshAsync(string cacheKey, CancellationToken cancellationToken)
    {
        var response = await posApiRestClient.ExecuteAsync<CustomerHasBetsResponse>(Request, cancellationToken);
        await SetToCache(cacheKey, response.HasBets, cancellationToken);
        return response.HasBets;
    }

    private async Task SetToCache(string cacheKey, bool response, CancellationToken cancellationToken)
    {
        var cacheEntryOptions = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1),
        };

        await distributedCache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(response), cacheEntryOptions, cancellationToken);
    }

    private string GetCacheKey()
    {
        var accountName = currentUserAccessor.User.FindValue(PosApiClaimTypes.AccountName);
        var userEmail = currentUserAccessor.User.FindValue(PosApiClaimTypes.Email);
        return $"BPOS:Betting:HasBets:{accountName}:{userEmail}";
    }
}
