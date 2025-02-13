using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.RealityCheck;

internal interface IRealityCheckServiceClient
{
    Task<RcpuStatusResponse> RcpuStatusAsync(ExecutionMode mode);
    Task RcpuContinueAsync(ExecutionMode mode);
    Task RcpuQuitAsync(ExecutionMode mode);
}

internal class RealityCheckServiceClient(IPosApiRestClient restClient) : IRealityCheckServiceClient
{
    public async Task<RcpuStatusResponse> RcpuStatusAsync(ExecutionMode mode)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.ResponsibleGaming.RealityCheckRcpuStatus) { Authenticate = true };

        return await restClient.ExecuteAsync<RcpuStatusResponse>(mode, request);
    }

    public async Task RcpuContinueAsync(ExecutionMode mode)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.ResponsibleGaming.RealityCheckRcpuContinue, HttpMethod.Post) { Authenticate = true };

        await restClient.ExecuteAsync(mode, request);
    }

    public async Task RcpuQuitAsync(ExecutionMode mode)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.ResponsibleGaming.RealityCheckRcpuQuit, HttpMethod.Post) { Authenticate = true };

        await restClient.ExecuteAsync(mode, request);
    }
}
