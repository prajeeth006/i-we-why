using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Diagnostics.Contracts;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Configuration;

internal sealed class FeatureConfigDiagnosticController(ICurrentConfigurationResolver configResolver)
    : SyncDiagnosticApiController
{
    public override DiagnosticsRoute GetRoute() => DiagnosticApiUrls.Configuration.Feature;

    public override object Execute(HttpContext httpContext)
    {
        if (!httpContext.Request.Query.TryGetValue("name", out var name))
        {
            return new { Message = $"Parameter {nameof(name)} is required." };
        }

        var result = configResolver.Resolve(name.ToString());

        return result;
    }
}
