#nullable enable

using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;

internal sealed class CacheLoyalyProfileLoginFilter(ILoyaltyProfileServiceClient loyaltyProfileServiceClient) : LoginFilter
{
    public override void AfterLogin(AfterLoginContext context)
    {
        var profile = context.Response.LoyaltyStatus;
        if (profile != null)
            loyaltyProfileServiceClient.SetToCache(profile);
    }
}
