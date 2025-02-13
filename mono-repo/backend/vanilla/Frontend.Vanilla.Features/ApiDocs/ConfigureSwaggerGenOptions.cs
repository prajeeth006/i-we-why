using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Features.Diagnostics.SiteVersion;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Frontend.Vanilla.Features.ApiDocs;

internal sealed class ConfigureSwaggerGenOptions(VanillaVersion version, IDiagnosticsComponentProvider diagnosticsComponentProvider) : IConfigureOptions<SwaggerGenOptions>
{
    public void Configure(SwaggerGenOptions options)
    {
        var currentVersion = version.Version.ToString();
        if (options.SwaggerGeneratorOptions.SwaggerDocs.TryGetValue(currentVersion, out _)) return;

        options.SwaggerDoc(currentVersion, new OpenApiInfo
        {
            Title = diagnosticsComponentProvider.Name,
            Version = currentVersion,
        });
    }
}
