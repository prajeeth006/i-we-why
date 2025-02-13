#nullable enable

using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;
using Frontend.Vanilla.Testing.AbstractTests;

namespace Frontend.Vanilla.Features.Tests.Visitor;

public class VisitorServicesTests : VanillaFeatureServicesTestsBase
{
    public static object TestCases => new DependencyInjectionTestCases
    {
        Services = new[]
        {
            typeof(IVisitorSettingsManager),
        },
        MultiServices = new[]
        {
            (typeof(ILoginFilter), typeof(LastVisitorLoginFilter)),
        },
    }.GetTestCases();
}
