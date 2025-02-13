using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.ScreenTime;

internal interface IScreenTimeServiceClient
{
    Task SaveScreenTimeAsync(ScreenTimeSaveRequest screenTimeSaveRequest, ExecutionMode mode);
}

internal class ScreenTimeServiceClient(IPosApiRestClient restClient) : IScreenTimeServiceClient
{
    public async Task SaveScreenTimeAsync(ScreenTimeSaveRequest screenTimeSaveRequest, ExecutionMode mode)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.ResponsibleGaming.ArcSaveScreenTime, HttpMethod.Post)
        {
            Authenticate = true,
            Content = screenTimeSaveRequest,
        };

        await restClient.ExecuteAsync(mode, request);
    }
}
