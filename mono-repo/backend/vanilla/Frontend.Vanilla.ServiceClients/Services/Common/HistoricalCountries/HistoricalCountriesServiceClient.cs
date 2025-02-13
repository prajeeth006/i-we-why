#nullable enable

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.HistoricalCountries;

internal interface IHistoricalCountriesServiceClient
{
    Task<IReadOnlyList<HistoricalCountry>> GetAsync(ExecutionMode mode, UtcDateTime? date);
}

internal sealed class HistoricalCountriesServiceClient(IGetDataServiceClient getDataServiceClient) : IHistoricalCountriesServiceClient
{
    public Task<IReadOnlyList<HistoricalCountry>> GetAsync(ExecutionMode mode, UtcDateTime? date)
    {
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.CommonData)
            .AppendPathSegment("Countries/Historical")
            .AppendTrailingSlash() // According to PosAPI contract
            .AddQueryParametersIfValueNotWhiteSpace(
                ("lang", CultureInfo.CurrentCulture.Name),
                ("date", date?.Value.ToString("yyyy-MM-dd")))
            .GetRelativeUri();

        return getDataServiceClient.GetAsync<HistoricalCountryResponse, IReadOnlyList<HistoricalCountry>>(mode, PosApiDataType.Static, url);
    }
}
