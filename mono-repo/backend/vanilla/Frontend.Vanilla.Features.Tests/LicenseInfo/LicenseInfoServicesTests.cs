using Frontend.Vanilla.Features.LicenseInfo;
using Frontend.Vanilla.Testing.AbstractTests;

namespace Frontend.Vanilla.Features.Tests.LicenseInfo;

public sealed class LicenseInfoServicesTests : VanillaFeatureServicesTestsBase
{
    public static object TestCases => new DependencyInjectionTestCases
    {
        Services = new[]
        {
            typeof(ILicenseInfoService),
        },
    }.GetTestCases();
}
