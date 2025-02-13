using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Dsl;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.InfoPages;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.LogAndTracing;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.ServerUtils;
using Frontend.Vanilla.Features.WebIntegration;
using Frontend.Vanilla.Testing.AbstractTests;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.HealthPages;

public class HealthPagesServicesTests : VanillaFeatureServicesTestsBase
{
    public static object TestCases => new DependencyInjectionTestCases
    {
        Services = new[]
        {
            typeof(IDiagnosticApiRoutesProvider),
        },
        MultiServices = new[]
        {
            (typeof(IDiagnosticApiController), typeof(DslExpressionTestDiagnosticController)),
            (typeof(IDiagnosticApiController), typeof(DslMetadataDiagnosticController)),
            (typeof(IDiagnosticApiController), typeof(DslProviderValuesDiagnosticController)),
            (typeof(IDiagnosticApiController), typeof(LogDiagnosticController)),
            (typeof(IDiagnosticApiController), typeof(StartTracingDiagnosticController)),
            (typeof(IDiagnosticApiController), typeof(StopTracingDiagnosticController)),
            (typeof(IDiagnosticApiController), typeof(TracingStatusDiagnosticController)),
            (typeof(IDiagnosticApiController), typeof(InfoPageDetailsController)),
            (typeof(IDiagnosticApiController), typeof(InfoPagesOverviewController)),
            (typeof(IDiagnosticApiController), typeof(ServerInfoDiagnosticController)),
            (typeof(IServerIPProvider), typeof(AspNetCoreServerIpAddress)),
        },
    }.GetTestCases();
}
