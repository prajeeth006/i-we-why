using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Features.Diagnostics.SiteAssemblies;
using Frontend.Vanilla.Features.Ioc;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Diagnostics.Health;

internal static class DiagnosticsHealthServices
{
    public static void AddDiagnosticsHealth(this IServiceCollection services)
    {
        services.AddSingleton<IHealthCheckExecutor, HealthCheckExecutor>();
        services.AddSingleton<IBootTask, HealthCheckValidationTask>();
        services.AddConfiguration<IHealthReportConfiguration, HealthReportConfiguration>(HealthReportConfiguration.FeatureName);
        services.AddSingleton<IDiagnosticInfoProvider, SiteAssembliesDiagnosticProvider>();
    }
}
