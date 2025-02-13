#nullable enable

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.Cities;

internal interface ICitiesServiceClient
{
    Task<IReadOnlyList<City>> GetAsync(ExecutionMode mode, string? countryId, string? countryAreaId);
}

internal sealed class CitiesServiceClient(IGetDataServiceClient getDataServiceClient) : ICitiesServiceClient
{
    public Task<IReadOnlyList<City>> GetAsync(ExecutionMode mode, string? countryId, string? countryAreaId)
    {
        // TODO: Read from PosApiEndpoint
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.CommonData)
            .AppendPathSegment("Cities")
            .AppendTrailingSlash() // According to PosAPI contract
            .AddQueryParametersIfValueNotWhiteSpace(
                ("lang", CultureInfo.CurrentCulture.Name),
                ("country", countryId),
                ("countryArea", countryAreaId))
            .GetRelativeUri();

        return getDataServiceClient.GetAsync<CitiesResponse, IReadOnlyList<City>>(mode, PosApiDataType.Static, url);
    }
}
