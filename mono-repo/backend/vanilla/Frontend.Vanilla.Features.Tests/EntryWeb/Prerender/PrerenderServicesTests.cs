using Frontend.Vanilla.Features.EntryWeb.Prerender;
using Frontend.Vanilla.Testing.AbstractTests;

namespace Frontend.Vanilla.Features.Tests.EntryWeb.Prerender;

public class PrerenderServicesTests : VanillaFeatureServicesTestsBase
{
    public static object TestCases => new DependencyInjectionTestCases
    {
        Services = new[]
        {
            typeof(IPrerenderService),
        },
    }.GetTestCases();
}
