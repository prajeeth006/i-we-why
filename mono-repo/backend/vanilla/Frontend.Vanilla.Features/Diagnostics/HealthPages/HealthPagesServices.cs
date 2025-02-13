using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Cache;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Configuration;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Content;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Dsl;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Health;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.HttpTester;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.InfoPages;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.LogAndTracing;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.ServerUtils;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.AssetsHandling;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages;

internal static class HealthPagesServices
{
    public static void AddDiagnosticsHealthPages(this IServiceCollection services)
    {
        // Assets
        services.AddSingleton<IAssemblyFileProvider, AssemblyFileProvider>();

        // API infrastructure
        services.AddSingleton<IDiagnosticApiControllerExecutor, DiagnosticApiControllerExecutor>();
        services.AddSingleton<IDiagnosticApiRoutesProvider, DiagnosticApiRoutesProvider>();

        // API controllers
        services.AddSingleton<IDiagnosticApiController, HealthDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, CacheInfoDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, CacheViewDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, HttpTesterDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, ConfigReportDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, DeleteConfigOverridesDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, PostConfigOverridesDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, ReceiveSharedConfigOverridesDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, ShareConfigOverridesDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, DslExpressionTestDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, DslMetadataDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, DslProviderValuesDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, ContentItemTestDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, ContentMetadataDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, LogDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, StartTracingDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, StopTracingDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, TracingStatusDiagnosticController>();
        services.AddConfiguration<ILogPageConfiguration, LogPageConfiguration>(LogPageConfiguration.FeatureName);
        services.AddSingleton<IDiagnosticApiController, InfoPageDetailsController>();
        services.AddSingleton<IDiagnosticApiController, InfoPagesOverviewController>();
        services.AddSingleton<IDiagnosticApiController, ServerInfoDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, ClearMemoryCacheDiagnosticController>();
        services.AddSingleton<IDiagnosticApiController, FeatureConfigDiagnosticController>();
    }
}
