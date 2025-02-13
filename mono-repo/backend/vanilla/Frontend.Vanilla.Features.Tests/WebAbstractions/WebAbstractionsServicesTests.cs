using Frontend.Vanilla.Testing.AbstractTests;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Tests.WebAbstractions;

public class WebAbstractionsServicesTests : VanillaFeatureServicesTestsBase
{
    public static object TestCases => new DependencyInjectionTestCases
    {
        Services = new[]
        {
            typeof(IHttpContextAccessor),
        },
        NotRegisteredServices = new[]
        {
            typeof(HttpContext),
        },
    }.GetTestCases();
}
