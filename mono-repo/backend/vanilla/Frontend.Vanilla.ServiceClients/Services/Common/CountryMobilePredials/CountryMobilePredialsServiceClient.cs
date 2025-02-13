#nullable enable

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.CountryMobilePredials;

internal interface ICountryMobilePredialsServiceClient
{
    Task<IReadOnlyList<CountryMobilePredial>> GetAsync(ExecutionMode mode, string? countryPredial);
}

internal class CountryMobilePredialsServiceClient(IGetDataServiceClient getDataServiceClient) : ICountryMobilePredialsServiceClient
{
    public Task<IReadOnlyList<CountryMobilePredial>> GetAsync(ExecutionMode mode, string? countryPredial)
    {
        Guard.Requires(
            countryPredial.IsNullOrWhiteSpace() || !countryPredial.StartsWith("+"),
            nameof(countryPredial),
            "CountryPredial must start with '+' if not null nor empty.");

        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.CommonData)
            .AppendPathSegment("CountryMobilePredial")
            .AppendTrailingSlash() // According to PosAPI contract
            .If(!string.IsNullOrWhiteSpace(countryPredial), b => b.AppendPathSegment(countryPredial ?? string.Empty))
            .GetRelativeUri();

        return getDataServiceClient.GetAsync<CountryMobilePredialsResponse, IReadOnlyList<CountryMobilePredial>>(mode, PosApiDataType.Static, url);
    }
}
