#nullable enable

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.Timezones;

internal interface ITimezonesServiceClient
{
    Task<IReadOnlyList<Timezone>> GetAsync(ExecutionMode mode);
}

internal sealed class TimezonesServiceClient(IGetDataServiceClient getDataServiceClient) : ITimezonesServiceClient
{
    public Task<IReadOnlyList<Timezone>> GetAsync(ExecutionMode mode)
    {
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.CommonData)
            .AppendPathSegment("Timezone")
            .AppendTrailingSlash() // According to PosAPI contract
            .GetRelativeUri();

        return getDataServiceClient.GetAsync<TimezoneResponse, IReadOnlyList<Timezone>>(mode, PosApiDataType.Static, url);
    }
}
