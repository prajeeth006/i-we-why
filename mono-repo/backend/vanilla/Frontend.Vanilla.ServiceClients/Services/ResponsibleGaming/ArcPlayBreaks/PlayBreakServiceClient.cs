using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.ArcPlayBreaks;

internal interface IPlayBreakServiceClient
{
    Task<ArcPlayBreakResponse> GetAsync(ExecutionMode mode, bool cached);
    Task<ArcPlayBreakActionResponse> AcknowledgePlayBreakAction(ArcPlayBreakActionRequest request, ExecutionMode mode);
}

internal sealed class PlayBreakServiceClient(IPosApiRestClient restClient, IGetDataServiceClient getDataServiceClient, IServiceClientsConfiguration config) : IPlayBreakServiceClient
{
    public Task<ArcPlayBreakResponse> GetAsync(ExecutionMode mode, bool cached)
    {
        const string cacheKey = "GetPlayBreak";
        var expiration = config.CacheTimeEndpoints.GetValue(cacheKey);

        return getDataServiceClient.GetAsync<ArcPlayBreakResponse, ArcPlayBreakResponse>(mode, PosApiDataType.User, PosApiEndpoint.ResponsibleGaming.ArcPlayBreakStatus, cached, cacheKey, expiration);
    }

    public async Task<ArcPlayBreakActionResponse> AcknowledgePlayBreakAction(ArcPlayBreakActionRequest actionRequest, ExecutionMode mode)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.ResponsibleGaming.ArcAcknowledgePlayBreakAction, HttpMethod.Post)
        {
            Authenticate = true,
            Content = actionRequest,
        };

        return await restClient.ExecuteAsync<ArcPlayBreakActionResponse>(mode, request);
    }
}
