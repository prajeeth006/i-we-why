using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Offers;

internal sealed class PosApiOffersServiceClient(IPosApiRestClient restClient) : IPosApiOffersServiceClient
{
    private static UriBuilder DataUrl => new UriBuilder()
        .AppendPathSegment(PosApiServiceNames.PromoHub);

    public Task<IReadOnlyList<PosApiKeyValuePair>> GetCountAsync(CancellationToken cancellationToken, string source)
    {
        var request = new PosApiRestRequest(DataUrl
            .AppendPathSegment("Offers")
            .AppendPathSegment("count")
            .AddQueryParameters(("source", source))
            .GetRelativeUri())
        {
            Authenticate = true,
        };

        return restClient.ExecuteAsync<IReadOnlyList<PosApiKeyValuePair>>(request, cancellationToken);
    }
}
