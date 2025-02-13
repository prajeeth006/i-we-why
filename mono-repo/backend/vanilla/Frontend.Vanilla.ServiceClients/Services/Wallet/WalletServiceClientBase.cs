using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet;

internal abstract class WalletServiceClientBase<T>(IPosApiRestClient restClient)
{
    protected async Task<T> GetAsync(CancellationToken cancellationToken, string path, bool authenticate = true, params (string Name, string Value)[] queryParameters)
    {
        var uri = GetRelativeUri(path, queryParameters);
        var request = new PosApiRestRequest(uri) { Authenticate = authenticate };
        var result = await restClient.ExecuteAsync<T>(request, cancellationToken);

        return result;
    }

    protected async Task<T> GetAsync(ExecutionMode mode, string path, bool authenticate = true)
    {
        var uri = GetRelativeUri(path);
        var request = new PosApiRestRequest(uri) { Authenticate = authenticate };
        var result = await restClient.ExecuteAsync<T>(mode, request);

        return result;
    }

    private static PathRelativeUri GetRelativeUri(string path, params (string Name, string Value)[] queryParameters)
    {
        var urlBuilder = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.Wallet)
            .AppendPathSegment(path);

        if (queryParameters.Any())
        {
            urlBuilder = urlBuilder.AddQueryParameters(queryParameters);
        }

        var uri = urlBuilder.GetRelativeUri();

        return uri;
    }
}
