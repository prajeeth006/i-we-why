using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.UserFlags;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class UserFlagsDslProvider(IPosApiCrmServiceInternal crmService, ICurrentUserAccessor currentUserAccessor) : IUserFlagsDslProvider
{
    public async Task<string> GetAsync(ExecutionMode mode, string name)
    {
        var userFlags = await GetUserFlagsAsync(mode);
        var userFlag = userFlags?.FirstOrDefault(uf => uf.Name.Equals(name, StringComparison.OrdinalIgnoreCase));

        return userFlag?.Value ?? string.Empty;
    }

    public async Task<bool> HasReasonCodeAsync(ExecutionMode mode, string reasonCodes)
    {
        var userFlags = await GetUserFlagsAsync(mode);
        var userReasonCodes = userFlags?
            .Where(f => f.ReasonCodes != null)
            .SelectMany(f => f.ReasonCodes)?
            .Distinct();

        var codes = reasonCodes.IndexOf(',') > -1
            ? reasonCodes.Split(',').Select(c => c.Trim())
            : new[] { reasonCodes.Trim() };

        var hasReasonCode = userReasonCodes?.Any(c => codes.Contains(c, StringComparer.OrdinalIgnoreCase)) ?? false;

        return hasReasonCode;
    }

    private async Task<IEnumerable<UserFlag>?> GetUserFlagsAsync(ExecutionMode mode)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
        {
            return null;
        }

        var userFlags = await crmService.GetUserFlagsAsync(mode);

        return userFlags;
    }
}
