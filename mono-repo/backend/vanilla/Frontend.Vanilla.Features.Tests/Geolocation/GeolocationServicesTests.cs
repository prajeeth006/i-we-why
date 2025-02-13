using Frontend.Vanilla.Features.Geolocation;
using Frontend.Vanilla.Features.Geolocation.PosApi;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.Testing.AbstractTests;

namespace Frontend.Vanilla.Features.Tests.Geolocation;

public class GeolocationServicesTests : VanillaFeatureServicesTestsBase
{
    public static object TestCases => new DependencyInjectionTestCases
    {
        Services = new[]
        {
            typeof(IGeolocationService),
        },
        MultiServices = new[]
        {
            (typeof(IPosApiRestRequestBuilder), typeof(GeolocationPosApiRestRequestBuilder)),
        },
    }.GetTestCases();
}
