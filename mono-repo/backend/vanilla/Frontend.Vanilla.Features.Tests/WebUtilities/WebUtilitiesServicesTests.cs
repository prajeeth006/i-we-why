using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing.AbstractTests;

namespace Frontend.Vanilla.Features.Tests.WebUtilities;

public class WebUtilitiesServicesTests : VanillaFeatureServicesTestsBase
{
    public static object TestCases => new DependencyInjectionTestCases
    {
        Services = new[]
        {
            typeof(IBrowserUrlProvider),
        },
    }.GetTestCases();
}
