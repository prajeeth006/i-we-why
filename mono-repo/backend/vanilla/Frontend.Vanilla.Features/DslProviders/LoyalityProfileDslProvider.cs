using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Crm2;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class LoyalityProfileDslProvider(ICrmServiceClient crmServiceClient, ICurrentUserAccessor currentUserAccessor) : ILoyalityProfileDslProvider
{
    private const decimal AnonymousValue = -1;

    public async Task<decimal> GetMlifeNoAsync(ExecutionMode mode)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn() || mode.AsyncCancellationToken == null)
        {
            return AnonymousValue;
        }

        var mlifeProfile = await crmServiceClient.GetMLifeProfileAsync(mode.AsyncCancellationToken.Value);

        return mlifeProfile?.MlifeNo ?? AnonymousValue;
    }

    public async Task<string> GetMlifeTierAsync(ExecutionMode mode)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn() || mode.AsyncCancellationToken == null)
        {
            return string.Empty;
        }

        var mlifeProfile = await crmServiceClient.GetMLifeProfileAsync(mode.AsyncCancellationToken.Value);

        return mlifeProfile?.Tier ?? string.Empty;
    }

    public async Task<decimal> GetMlifetierCreditsAsync(ExecutionMode mode)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn() || mode.AsyncCancellationToken == null)
        {
            return AnonymousValue;
        }

        var mlifeProfile = await crmServiceClient.GetMLifeProfileAsync(mode.AsyncCancellationToken.Value);

        return mlifeProfile?.TierCredits ?? AnonymousValue;
    }

    public async Task<string> GetMlifeTierDescAsync(ExecutionMode mode)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn() || mode.AsyncCancellationToken == null)
        {
            return string.Empty;
        }

        var mlifeProfile = await crmServiceClient.GetMLifeProfileAsync(mode.AsyncCancellationToken.Value);

        return mlifeProfile?.TierDesc ?? string.Empty;
    }
}
