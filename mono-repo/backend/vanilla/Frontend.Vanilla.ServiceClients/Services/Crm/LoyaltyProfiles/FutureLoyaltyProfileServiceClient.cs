using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;

internal interface IFutureLoyaltyProfileServiceClient
{
    Task<BasicLoyaltyProfile> GetBasicProfileAsync(ExecutionMode mode, bool cached);
    Task<LoyaltyProfile> GetFullProfileAsync(ExecutionMode mode, bool cached);
}

internal sealed class FutureLoyaltyProfileServiceClient(
    ILoyaltyProfileServiceClient loyaltyProfileServiceClient,
    IBasicLoyaltyProfileServiceClient basicLoyaltyProfileServiceClient,
    IPosApiDataCache posApiDataCache)
    : IFutureLoyaltyProfileServiceClient
{
    public async Task<BasicLoyaltyProfile> GetBasicProfileAsync(ExecutionMode mode, bool cached)
    {
        if (!cached)
        {
            InvalidateCached();
        }
        else
        {
            // check if LoyaltyProfile is already cached in CacheLoyalyProfileLoginFilter and if yes return that value
            var cachedLoyaltyProfile = await posApiDataCache.GetAsync<LoyaltyProfile>(mode, PosApiDataType.User, "LoyaltyProfile");
            if (cachedLoyaltyProfile?.Value != null)
            {
                return cachedLoyaltyProfile.Value;
            }
        }

        return await basicLoyaltyProfileServiceClient.GetAsync(mode, cached);
    }

    public Task<LoyaltyProfile> GetFullProfileAsync(ExecutionMode mode, bool cached)
    {
        if (!cached) InvalidateCached();

        return loyaltyProfileServiceClient.GetAsync(mode, cached);
    }

    private void InvalidateCached()
    {
        loyaltyProfileServiceClient.InvalidateCached();
        basicLoyaltyProfileServiceClient.InvalidateCached();
    }
}
