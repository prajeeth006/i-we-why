#nullable enable

using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Security.Claims.Local;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication;

/// <summary>
/// Gets PosAPI claims according to given auth tokens.
/// There are also local claims, see <see cref="ILocalClaimsResolver" />.
/// </summary>
internal interface IPosApiClaimsServiceClient
{
    Task<IReadOnlyList<Claim>> GetAsync(ExecutionMode mode, PosApiAuthTokens? authTokens, bool cached);
}

internal sealed class PosApiClaimsServiceClient(IPosApiRestClient restClient, IPosApiClaimsDeserializer claimsDeserializer) : IPosApiClaimsServiceClient
{
    public async Task<IReadOnlyList<Claim>> GetAsync(ExecutionMode mode, PosApiAuthTokens? authTokens, bool cached)
    {
        // TODO: Read from PosApiEndpoint
        var request = new PosApiRestRequest(
            new UriBuilder()
                .AppendPathSegment(PosApiServiceNames.Authentication)
                .AppendPathSegment(authTokens != null ? "ClaimsUnauthorized" : "AnonymousClaims")
                .AddQueryParameters(("cached", cached.ToInvariantString()))
                .GetRelativeUri());

        if (authTokens != null)
        {
            request.Headers.Add(PosApiHeaders.UserToken, authTokens.UserToken);
            request.Headers.Add(PosApiHeaders.SessionToken, authTokens.SessionToken);
        }

        var response = await restClient.ExecuteAsync<ClaimsResponse>(mode, request);

        return claimsDeserializer.Deserialize(response, authTokens);
    }
}
