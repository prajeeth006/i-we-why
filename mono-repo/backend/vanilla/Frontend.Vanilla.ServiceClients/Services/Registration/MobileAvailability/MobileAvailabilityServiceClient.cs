using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Registration.MobileAvailability;

/// <summary>
/// Checks validity of current user and session tokens on PosAPI side without executing any heavier operation.
/// </summary>
internal interface IMobileAvailabilityServiceClient
{
    Task VerifyAsync(CancellationToken cancellationToken, string countryCode, string mobileNumber);
}

internal sealed class MobileAvailabilityServiceClient(IPosApiRestClient restClient) : IMobileAvailabilityServiceClient
{
    public Task VerifyAsync(CancellationToken cancellationToken, string countryCode, string mobileNumber)
    {
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.Registration)
            .AppendPathSegment("MobileAvailability")
            .AddQueryParameters(("mobileCountryCode", countryCode))
            .AddQueryParameters(("mobile", mobileNumber))
            .GetRelativeUri();

        return restClient.ExecuteAsync(new PosApiRestRequest(url), cancellationToken);
    }
}
