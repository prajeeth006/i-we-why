using System;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Diagnostics.Contracts;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Configuration;

internal sealed class ReceiveSharedConfigOverridesDiagnosticController(IConfigurationOverridesService overridesService) : SyncDiagnosticApiController
{
    public override DiagnosticsRoute GetRoute() => DiagnosticApiUrls.Configuration.SharedOverrides.ReceiveUrl;

    public override object? Execute(HttpContext httpContext)
    {
        JObject overridesJson;

        try
        {
            var overridesStr = httpContext.Request.Query[DiagnosticApiUrls.Configuration.SharedOverrides.OverridesParameter].ToString();
            overridesJson = JObject.Parse(overridesStr);
        }
        catch (Exception ex)
        {
            return httpContext.CreateBadRequest(ex, $"Invalid JSON in input query parameter '{DiagnosticApiUrls.Configuration.SharedOverrides.OverridesParameter}'.")
                .AsTask<object>();
        }

        try
        {
            overridesService.SetJson(overridesJson);
            httpContext.Response.Redirect("/", permanent: false);

            return null;
        }
        catch (Exception ex)
        {
            return httpContext.CreateBadRequest(ex, "Failed applying received configuration overrides.");
        }
    }
}
