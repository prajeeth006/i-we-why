using Frontend.Vanilla.Features.ContentEndpoint;
using Frontend.Vanilla.Testing.AbstractTests;
using Microsoft.Extensions.Options;

namespace Frontend.Vanilla.Features.Tests.ContentEndpoint;

public class ContentEndpointServicesTests : VanillaFeatureServicesTestsBase
{
    public static object TestCases => new DependencyInjectionTestCases
    {
        Services = new[]
        {
            typeof(IContentEndpointService),
            typeof(IOptions<ContentEndpointOptions>),
        },
    }.GetTestCases();
}
