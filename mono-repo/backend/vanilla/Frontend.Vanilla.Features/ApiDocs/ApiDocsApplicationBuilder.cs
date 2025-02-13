using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Features.Diagnostics.SiteVersion;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.ApiDocs;

internal static class ApiDocsApplicationBuilder
{
    public static void UseApiDocs(this IApplicationBuilder app)
    {
        var version = app.ApplicationServices.GetRequiredService<VanillaVersion>();
        var diagnosticsComponentProvider = app.ApplicationServices.GetRequiredService<IDiagnosticsComponentProvider>();
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.RoutePrefix = "docs";
            c.SwaggerEndpoint($"/swagger/{version.Version}/swagger.json", diagnosticsComponentProvider.Name);
        });
    }
}
