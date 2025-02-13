using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Account.MohDetails;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class MohDetailsDslProvider(
    IPosApiAccountServiceInternal accountService,
    ICurrentUserAccessor currentUserAccessor)
    : IMohDetailsDslProvider
{
    public async Task<string> GetCommentsAsync(ExecutionMode mode)
        => await GetProperty<string>(mode, (m) => m.Comments);

    public async Task<string> GetCountryCodeAsync(ExecutionMode mode)
        => await GetProperty<string>(mode, (m) => m.CountryCode);

    public async Task<decimal> GetExclDaysAsync(ExecutionMode mode)
        => await GetProperty<decimal>(mode, (m) => m.ExclDays);

    public async Task<decimal> GetMohPrimaryProductCodeAsync(ExecutionMode mode)
        => await GetProperty<decimal>(mode, (m) => m.MohPrimaryProductCode);

    public async Task<decimal> GetMohPrimaryReasonCodeAsync(ExecutionMode mode)
        => await GetProperty<decimal>(mode, (m) => m.MohPrimaryReasonCode);

    public async Task<decimal> GetMohPrimaryRiskBandCodeAsync(ExecutionMode mode)
        => await GetProperty<decimal>(mode, (m) => m.MohPrimaryRiskBandCode);

    public async Task<decimal> GetMohPrimaryToolCodeAsync(ExecutionMode mode)
        => await GetProperty<decimal>(mode, (m) => m.MohPrimaryToolCode);

    public async Task<decimal> GetMohScoreAsync(ExecutionMode mode)
        => await GetProperty<decimal>(mode, (m) => m.MohScore);

    public async Task<string> GetProcessedAsync(ExecutionMode mode)
        => await GetProperty<string>(mode, (m) => m.Processed);

    public async Task<string> GetVipUserAsync(ExecutionMode mode)
        => await GetProperty<string>(mode, (m) => m.VipUser);

    private async Task<T> GetProperty<T>(ExecutionMode mode, Func<MohDetailsResponse, T> getValue)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
        {
            var defaultMohDetails = new MohDetailsResponse();

            return getValue(defaultMohDetails);
        }

        var mohDetails = await accountService.GetMohDetailsAsync(mode);

        return getValue(mohDetails);
    }
}
