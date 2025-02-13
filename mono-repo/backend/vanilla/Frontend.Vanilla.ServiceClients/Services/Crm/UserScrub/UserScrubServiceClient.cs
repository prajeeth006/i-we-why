using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.UserScrub;

internal interface IUserScrubServiceClient
{
    Task<UserScrub> GetAsync(ExecutionMode mode, UserScrubRequest request);
}

internal class UserScrubServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache, ILogger<UserScrubServiceClient> log)
    : IUserScrubServiceClient
{
    public Task<UserScrub> GetAsync(ExecutionMode mode, UserScrubRequest request)
        => cache.GetOrCreateAsync(mode, PosApiDataType.User, "Player-Scrub", () => GetFreshAsync(mode, request));

    private async Task<UserScrub> GetFreshAsync(ExecutionMode mode, UserScrubRequest userScrubRequest)
    {
        try
        {
            var request = new PosApiRestRequest(PosApiEndpoint.Crm.PlayerScrub, HttpMethod.Post)
            {
                Authenticate = true,
                Content = userScrubRequest,
            };

            return await restClient.ExecuteAsync<UserScrub>(mode, request);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed getting player scrub data");

            return new UserScrub(false, new List<string>());
        }
    }
}
