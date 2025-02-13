using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Testing.AbstractTests;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class DslProvidersServicesTests : VanillaFeatureServicesTestsBase
{
    public static object TestCases => new DependencyInjectionTestCases
    {
        Services = new[]
        {
            typeof(IDslCompiler), // Depends on all providers
        },
    }.GetTestCases();
}
