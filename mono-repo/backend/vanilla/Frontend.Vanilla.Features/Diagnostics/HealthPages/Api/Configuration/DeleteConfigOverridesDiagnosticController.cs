using System;
using System.Net.Http;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Json;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Diagnostics.Contracts;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Configuration;

internal sealed class DeleteConfigOverridesDiagnosticController(IConfigurationOverridesService overridesService) : SyncDiagnosticApiController
{
    private const StringComparison Comparison = StringComparison.OrdinalIgnoreCase;

    public override DiagnosticsRoute GetRoute()
        => new (HttpMethod.Delete, DiagnosticApiUrls.Configuration.Overrides.UrlTemplate);

    public override object? Execute(HttpContext httpContext)
    {
        try
        {
            var featureName = httpContext.Request.RouteValues.GetString(DiagnosticApiUrls.Configuration.Overrides.FeatureParameter, "route value");
            var keyName = httpContext.Request.RouteValues.GetString(DiagnosticApiUrls.Configuration.Overrides.KeyParameter, "route value");

            if (!featureName.IsNullOrWhiteSpace())
            {
                var allOverridesJson = overridesService.GetJson();
                var allFeaturesJson = allOverridesJson.Get<JObject>(nameof(ConfigurationResponse.Configuration), Comparison);
                var featureJson = allFeaturesJson?.Get<JObject>(featureName, Comparison);

                if (allFeaturesJson == null || featureJson == null)
                {
                    return null;
                }

                if (!keyName.IsNullOrWhiteSpace())
                {
                    featureJson.Remove(keyName, Comparison);
                }

                if (keyName.IsNullOrWhiteSpace() || !featureJson.HasValues)
                {
                    allFeaturesJson.Remove(featureName, Comparison);
                }

                if (allFeaturesJson.HasValues) // If other overrides left
                {
                    overridesService.SetJson(allOverridesJson);

                    return new MessageDto("Overrides deleted successfully. Some others are left.");
                }
            }

            overridesService.Clear();

            return new MessageDto("Overrides deleted successfully. No others are left.");
        }
        catch (Exception ex)
        {
            return httpContext.CreateBadRequest(ex);
        }
    }
}
