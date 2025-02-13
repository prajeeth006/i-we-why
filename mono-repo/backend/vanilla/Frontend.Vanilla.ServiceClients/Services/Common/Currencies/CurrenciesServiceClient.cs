#nullable enable

using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.Currencies;

internal interface ICurrenciesServiceClient
{
    Task<IReadOnlyList<Currency>> GetAsync(ExecutionMode mode);
}

internal sealed class CurrenciesServiceClient(IGetDataServiceClient getDataServiceClient) : ICurrenciesServiceClient
{
    public Task<IReadOnlyList<Currency>> GetAsync(ExecutionMode mode)
    {
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.CommonData)
            .AppendPathSegment("Currency")
            .AppendTrailingSlash() // According to PosAPI contract
            .AddQueryParameters(("lang", CultureInfo.CurrentCulture.Name))
            .GetRelativeUri();

        return getDataServiceClient.GetAsync<CurrenciesResponse, IReadOnlyList<Currency>>(mode, PosApiDataType.Static, url);
    }
}
