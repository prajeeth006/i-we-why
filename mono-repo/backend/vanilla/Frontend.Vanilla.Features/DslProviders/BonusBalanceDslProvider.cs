using System;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Crm;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class BonusBalanceDslProvider(ICurrentUserAccessor currentUserAccessor, IPosApiCrmServiceInternal posApiCrmService)
    : IBonusBalanceDslProvider
{
    public async Task<decimal> GetAsync(ExecutionMode mode, string product)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
            return BalanceDslExecutor.AnonymousValue;

        var bonusBalance = await posApiCrmService.GetBonusBalanceAsync(mode);

        return bonusBalance.Values
            .SelectMany(b => b.Bonuses)
            .Where(b => b.ApplicableProducts.Contains(product, StringComparer.InvariantCultureIgnoreCase) && b.IsBonusActive)
            .Sum(b => b.BonusAmount);
    }

    public async Task<decimal> GetBonusByTypeAsync(ExecutionMode mode, string bonusType)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
            return BalanceDslExecutor.AnonymousValue;

        var bonusBalance = await posApiCrmService.GetBonusBalanceAsync(mode);

        return bonusBalance.Where(b => b.Key.Equals(bonusType, StringComparison.InvariantCultureIgnoreCase))
            .Select(x => x.Value)
            .SelectMany(c => c.Bonuses)
            .Where(b => b.IsBonusActive)
            .Sum(b => b.BonusAmount);
    }
}
