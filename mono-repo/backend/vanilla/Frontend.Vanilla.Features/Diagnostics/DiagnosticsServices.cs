using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Features.Diagnostics.Health;
using Frontend.Vanilla.Features.Diagnostics.HealthPages;
using Frontend.Vanilla.Features.Diagnostics.SiteVersion;
using Frontend.Vanilla.Features.Diagnostics.Tracing;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Diagnostics;

internal static class DiagnosticsServices
{
    public static void AddDiagnosticsFeature(this IServiceCollection services)
    {
        services.AddDiagnosticsHealth();
        services.AddDiagnosticsHealthPages();
        services.AddDiagnosticsTracing();

        services.AddSingleton<IDiagnosticInfoProvider, AppConfigurationDiagnosticProvider>();
        services.AddSingleton<IDiagnosticInfoProvider, HttpRequestDiagnosticProvider>();
        services.AddSingleton<IDiagnosticInfoProvider, ClaimsDiagnosticInfoProvider>();
        services.AddSingleton<IDiagnosticInfoProvider, RouteDiagnosticProvider>();
        services.AddSingleton<IDiagnosticInfoProvider, ServerInfoDiagnosticProvider>();
        services.AddConfiguration<IGlobalJavascriptErrorHandlerConfiguration, GlobalJavascriptErrorHandlerConfiguration>(GlobalJavascriptErrorHandlerConfiguration.FeatureName);
    }
}
