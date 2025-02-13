#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;

internal interface IMappedLocationServiceClient
{
    Task<MappedGeolocation?> GetAsync(GeolocationCoordinates coordinates, CancellationToken cancellationToken);
}

internal sealed class MappedLocationServiceClient(IPosApiRestClient restClient, ICurrentUserAccessor currentUserAccessor, ILogger<MappedLocationServiceClient> log)
    : IMappedLocationServiceClient
{
    public async Task<MappedGeolocation?> GetAsync(GeolocationCoordinates coordinates, CancellationToken cancellationToken)
    {
        try
        {
            var request = new PosApiRestRequest(new UriBuilder()
                .AppendPathSegment(PosApiServiceNames.GeoLocation)
                .AppendPathSegment("mappedLocation")
                .AddQueryParametersIfValueNotWhiteSpace(CoordinatesProperties.Select(p => (p.Name, p.GetValue(coordinates)?.ToInvariantString())))
                .GetRelativeUri());

            var authTokens = currentUserAccessor.User.GetPosApiAuthTokens();
            if (authTokens != null)
                request.Headers.Add(
                    (PosApiHeaders.UserToken, authTokens.UserToken),
                    (PosApiHeaders.SessionToken, authTokens.SessionToken));

            return await restClient.ExecuteAsync<MappedGeolocation>(request, cancellationToken);
        }
        catch (PosApiException paex) when (paex.PosApiCode == ErrorCodes.NoLocationMatched)
        {
            return null;
        }
        catch (PosApiException paex) when (paex.PosApiCode.EqualsAny(ErrorCodes.AccuracyOutOfLimits, ErrorCodes.MultipleLocationsMatched))
        {
            log.LogWarning("Mapped GEO location is not found because {posApiCode} {posApiMessage}. Location data on backend could be improved accordingly",
                paex.PosApiCode,
                paex.PosApiMessage);

            return null;
        }
    }

    public static class ErrorCodes
    {
        public const int AccuracyOutOfLimits = 1001;
        public const int NoLocationMatched = 1002;
        public const int MultipleLocationsMatched = 1003;
    }

    private static readonly IReadOnlyList<(string Name, Func<GeolocationCoordinates, double?> GetValue)> CoordinatesProperties
        = typeof(GeolocationCoordinates).GetProperties()
            .ConvertAll(p => (p.Name.ToCamelCase(), GetValue: p.GetMethod!.Compile<Func<GeolocationCoordinates, double?>>()));
}
