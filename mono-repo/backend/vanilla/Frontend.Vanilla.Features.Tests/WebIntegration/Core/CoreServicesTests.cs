using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Features.WebIntegration;
using Frontend.Vanilla.Features.WebIntegration.Core;
using Frontend.Vanilla.Testing.AbstractTests;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Core;

public class CoreServicesTests : VanillaFeatureServicesTestsBase
{
    public static object TestCases => new DependencyInjectionTestCases
    {
        ServiceImpls = new[]
        {
            (typeof(ICurrentContextAccessor), typeof(WebContextAccessor)),
        },
        Services = new[]
        {
            typeof(IEnvironmentNameProvider),
            typeof(ISingleDomainAppConfiguration),
        },
    }.GetTestCases();
}
