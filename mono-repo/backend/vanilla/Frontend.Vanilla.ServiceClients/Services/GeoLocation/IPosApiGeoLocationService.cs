#nullable enable

using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;

namespace Frontend.Vanilla.ServiceClients.Services.GeoLocation;

/// <summary>
/// IPosApiGeoLocationService.
/// </summary>
internal interface IPosApiGeoLocationService
{
    /// <summary>
    /// GetMappedLocationAsync.
    /// </summary>
    /// <param name="coordinates"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [DelegateTo(typeof(IMappedLocationServiceClient), nameof(IMappedLocationServiceClient.GetAsync))]
    Task<MappedGeolocation?> GetMappedLocationAsync(GeolocationCoordinates coordinates, CancellationToken cancellationToken);
}
