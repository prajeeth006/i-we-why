#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.ClientInfo;

internal interface IClientInformationServiceClient
{
    Task<ClientInformation> GetAsync(ExecutionMode mode);
}

internal class ClientInformationServiceClient(IGetDataServiceClient getDataServiceClient, IServiceClientsConfiguration config) : IClientInformationServiceClient
{
    public Task<ClientInformation> GetAsync(ExecutionMode mode)
        => getDataServiceClient.GetAsync<ClientInformation, ClientInformation>(
            mode,
            PosApiDataType.Static,
            PosApiEndpoint.CommonData.ClientInformation,
            cacheKey: $"{PosApiEndpoint.CommonData.ClientInformation}#{config.AccessId}");
}
