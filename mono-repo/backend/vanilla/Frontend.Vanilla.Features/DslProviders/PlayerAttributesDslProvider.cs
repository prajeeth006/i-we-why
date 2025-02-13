using System;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.PlayerAttributes;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class PlayerAttributesDslProvider(IPosApiCrmServiceInternal posApiCrmServiceInternal, ICurrentUserAccessor currentUserAccessor)
    : IPlayerAttributesDslProvider
{
    public async Task<string> GetAcknowledgedAsync(ExecutionMode mode, string key)
    {
        var response = await GetPlayerAttributesAsync(mode);
        var attribute = response?.Attributes.Acknowledgement
            .FirstOrDefault(a => string.Equals(a.Key.ToString(), key, StringComparison.CurrentCultureIgnoreCase))
            .Value;

        return attribute?.Value.ToString() ?? string.Empty;
    }

    public async Task<string> GetVipAsync(ExecutionMode mode, string key)
    {
        var response = await GetPlayerAttributesAsync(mode);
        var attribute = response?.Attributes.Vip
            .FirstOrDefault(a => string.Equals(a.Key.ToString(), key, StringComparison.CurrentCultureIgnoreCase))
            .Value;

        return attribute?.Value.ToString() ?? string.Empty;
    }

    private async Task<PlayerAttributesDto?> GetPlayerAttributesAsync(ExecutionMode mode)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
        {
            return null;
        }

        return await posApiCrmServiceInternal.GetPlayerAttributesAsync(mode);
    }
}
