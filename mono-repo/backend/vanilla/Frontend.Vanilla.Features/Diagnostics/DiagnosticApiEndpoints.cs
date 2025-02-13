using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Diagnostics;

internal static class DiagnosticApiEndpoints
{
    public static void MapDiagnosticApiEndpoints(this IEndpointRouteBuilder builder)
    {
        var diagnosticApiRoutesProvider = builder.ServiceProvider.GetRequiredService<IDiagnosticApiRoutesProvider>();

        foreach (var route in diagnosticApiRoutesProvider.GetRoutes())
            builder.MapMethods(route.UrlPattern, route.HttpMethods, _ => route.ExecuteAsync());
    }
}
