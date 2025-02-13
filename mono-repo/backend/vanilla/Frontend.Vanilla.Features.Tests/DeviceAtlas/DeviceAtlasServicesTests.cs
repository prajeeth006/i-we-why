using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DeviceAtlas;
using Frontend.Vanilla.Testing.AbstractTests;

namespace Frontend.Vanilla.Features.Tests.DeviceAtlas;

public class DeviceAtlasServicesTests : VanillaFeatureServicesTestsBase
{
    public static object TestCases => new DependencyInjectionTestCases
    {
        Services = new[]
        {
            typeof(IDeviceAtlasService),
        },
        MultiServices = new[]
        {
            (typeof(IDiagnosticInfoProvider), typeof(DeviceCapabilitiesDiagnosticProvider)),
        },
    }.GetTestCases();
}
