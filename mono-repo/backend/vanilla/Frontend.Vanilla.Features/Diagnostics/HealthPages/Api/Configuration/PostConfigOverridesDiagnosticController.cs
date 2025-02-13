using System;
using System.IO;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Core.Json;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Configuration;

internal sealed class PostConfigOverridesDiagnosticController(IConfigurationOverridesService overridesService) : IDiagnosticApiController
{
    private const StringComparison Comparison = StringComparison.OrdinalIgnoreCase;

    public DiagnosticsRoute GetRoute()
        => new (HttpMethod.Post, DiagnosticApiUrls.Configuration.Overrides.UrlTemplate);

    public async Task<object?> ExecuteAsync(HttpContext httpContext)
    {
        try
        {
            var overridesJsonToSet = await ReadJsonAsync(httpContext.Request.Body, httpContext.RequestAborted);
            var featureName = httpContext.GetRouteValue(DiagnosticApiUrls.Configuration.Overrides.FeatureParameter);
            var keyName = httpContext.GetRouteValue(DiagnosticApiUrls.Configuration.Overrides.KeyParameter);

            var allOverridesJson = overridesService.GetJson();

            if (!featureName.IsNullOrWhiteSpace())
            {
                var allFeaturesJson = allOverridesJson.GetOrAdd<JObject>(nameof(ConfigurationResponse.Configuration), Comparison);
                var featureJson = allFeaturesJson.GetOrAdd<JObject>(featureName, Comparison);

                if (!keyName.IsNullOrWhiteSpace())
                    featureJson.Set(keyName, Comparison, new JObject
                    {
                        [nameof(KeyConfiguration.Values)] = new JArray
                        {
                            new JObject
                            {
                                [nameof(ValueConfiguration.Value)] = overridesJsonToSet,
                                [nameof(ValueConfiguration.Priority)] = new JValue(ulong.MaxValue),
                            },
                        },
                    });
                else
                    featureJson.Replace(overridesJsonToSet);
            }
            else
            {
                allOverridesJson = (JObject)overridesJsonToSet;
            }

            overridesService.SetJson(allOverridesJson);

            return new MessageDto("Overrides successfully applied.");
        }
        catch (Exception ex)
        {
            return httpContext.CreateBadRequest(ex);
        }
    }

    private static async Task<JToken> ReadJsonAsync(Stream stream, CancellationToken cancellationToken)
    {
        using var streamReader = new StreamReader(stream);
        await using var jsonReader = new JsonTextReader(streamReader);

        return await JToken.ReadFromAsync(jsonReader, cancellationToken); // await b/c using should Dispose() after await finished
    }
}
