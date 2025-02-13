#nullable enable

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.List;

internal interface IListServiceClient
{
    Task<IReadOnlyList<string>> GetAsync(ExecutionMode mode, string listName);
}

internal sealed class ListServiceClient(IGetDataServiceClient getDataServiceClient) : IListServiceClient
{
    public Task<IReadOnlyList<string>> GetAsync(ExecutionMode mode, string listName)
    {
        // TODO: Read from PosApiEndpoint
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.CommonData)
            .AppendPathSegment("List")
            .AppendPathSegment(listName)
            .GetRelativeUri();

        return getDataServiceClient.GetAsync<ListResponse, IReadOnlyList<string>>(mode, PosApiDataType.Static, url);
    }
}
