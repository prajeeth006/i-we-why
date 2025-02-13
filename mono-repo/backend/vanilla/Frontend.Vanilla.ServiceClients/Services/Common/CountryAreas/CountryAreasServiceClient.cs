#nullable enable

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.CountryAreas;

internal interface ICountryAreasServiceClient
{
    Task<IReadOnlyList<CountryArea>> GetAsync(ExecutionMode mode, string? countryId);
}

internal sealed class CountryAreasServiceClient(IGetDataServiceClient getDataServiceClient) : ICountryAreasServiceClient
{
    public Task<IReadOnlyList<CountryArea>> GetAsync(ExecutionMode mode, string? countryId)
    {
        // TODO: Read from PosApiEndpoint
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.CommonData)
            .AppendPathSegment("CountryArea")
            .AppendTrailingSlash() // According to PosAPI contract
            .AddQueryParametersIfValueNotWhiteSpace(
                ("lang", CultureInfo.CurrentCulture.Name),
                ("country", countryId))
            .GetRelativeUri();

        return getDataServiceClient.GetAsync<CountryAreaResponse, IReadOnlyList<CountryArea>>(mode, PosApiDataType.Static, url);
    }
}
