using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Testing.AbstractTests;

namespace Frontend.Vanilla.Features.Tests.Cookies;

public class CookiesServicesTests : VanillaFeatureServicesTestsBase
{
    public static object TestCases => new DependencyInjectionTestCases
    {
        Services = new[]
        {
            typeof(ICookieConfiguration),
            typeof(ICookieJsonHandler),
            typeof(ICookieHandler),
        },
        MultiServices = new[]
        {
            (typeof(IDiagnosticInfoProvider), typeof(CookiesDiagnosticProvider)),
        },
    }.GetTestCases();
}
