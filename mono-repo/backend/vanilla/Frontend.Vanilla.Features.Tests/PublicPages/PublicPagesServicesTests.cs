using Frontend.Vanilla.Features.PublicPages;
using Frontend.Vanilla.Testing.AbstractTests;

namespace Frontend.Vanilla.Features.Tests.PublicPages;

public class PublicPagesServicesTests : VanillaFeatureServicesTestsBase
{
    public static object TestCases => new DependencyInjectionTestCases
    {
        Services = new[]
        {
            typeof(IRequestedContentValidator),
        },
    }.GetTestCases();
}
