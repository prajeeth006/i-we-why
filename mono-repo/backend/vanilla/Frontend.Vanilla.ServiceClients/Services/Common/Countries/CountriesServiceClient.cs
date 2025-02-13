#nullable enable

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.Countries;

internal interface ICountriesServiceClient
{
    Task<IReadOnlyList<Country>> GetAsync(ExecutionMode mode);
    Task<IReadOnlyList<Country>> GetAllAsync(ExecutionMode mode);
}

internal sealed class CountriesServiceClient(IGetDataServiceClient getDataServiceClient) : ICountriesServiceClient
{
    public Task<IReadOnlyList<Country>> GetAsync(ExecutionMode mode)
        => ExecuteInternalAsync(mode, path: "Country");

    public Task<IReadOnlyList<Country>> GetAllAsync(ExecutionMode mode)
        => ExecuteInternalAsync(mode, path: "AllCountries");

    private Task<IReadOnlyList<Country>> ExecuteInternalAsync(ExecutionMode mode, string path)
    {
        // TODO: Read from PosApiEndpoint
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.CommonData)
            .AppendPathSegment(path)
            .AppendTrailingSlash() // According to PosAPI contract
            .AddQueryParameters(("lang", CultureInfo.CurrentCulture.Name))
            .GetRelativeUri();

        return getDataServiceClient.GetAsync<CountriesResponse, IReadOnlyList<Country>>(mode, PosApiDataType.Static, url);
    }
}
