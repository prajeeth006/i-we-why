using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using System.Net.Http;
using System.Threading.Tasks;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.SessionLimits;

internal interface ISessionLimitsServiceClient
{
    Task SaveUserPopupSelection(ExecutionMode mode, SessionLimitsData sessionLimitData);
}

internal class SessionLimitsServiceClient(IPosApiRestClient restClient) : ISessionLimitsServiceClient
{
    public async Task SaveUserPopupSelection(ExecutionMode mode, SessionLimitsData sessionLimitData)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.Authentication.SaveSessionLimitsPopupAction, HttpMethod.Post)
        {
            Authenticate = true,
            Content = sessionLimitData,
        };

        await restClient.ExecuteAsync(mode, request);
    }
}
