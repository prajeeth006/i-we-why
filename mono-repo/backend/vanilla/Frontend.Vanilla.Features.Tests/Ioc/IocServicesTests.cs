using Frontend.Vanilla.Features.Ioc;
using Frontend.Vanilla.Testing.AbstractTests;

namespace Frontend.Vanilla.Features.Tests.Ioc;

public class IocServicesTests : VanillaFeatureServicesTestsBase
{
    public static object TestCases => new DependencyInjectionTestCases
    {
        Services = new[]
        {
            typeof(IBootTaskExecutor),
        },
    }.GetTestCases();
}
