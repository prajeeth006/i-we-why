using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Crm;

namespace Frontend.Vanilla.Features.UserScrub;

internal interface IUserScrubService
{
    Task<IEnumerable<string>> ScrubbedForAsync(ExecutionMode executionMode);
}

internal sealed class UserScrubService(
    IPosApiCrmServiceInternal posApiCrmService,
    ICurrentUserAccessor currentUserAccessor,
    IUserScrubConfiguration userScrubConfiguration)
    : IUserScrubService
{
    public async Task<IEnumerable<string>> ScrubbedForAsync(ExecutionMode mode)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn()) return Enumerable.Empty<string>();

        var userScrub = await posApiCrmService.GetUserScrubAsync(mode, userScrubConfiguration.PlayerScrubRequest);

        return userScrub.PlayerScrubbed ? userScrub.ProductList : Enumerable.Empty<string>();
    }
}
