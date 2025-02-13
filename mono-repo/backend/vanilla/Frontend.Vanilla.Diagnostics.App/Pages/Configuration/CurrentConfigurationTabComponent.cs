using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Diagnostics.App.Infrastructure;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Configuration;
using Microsoft.AspNetCore.Components;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Diagnostics.App.Pages.Configuration;

public abstract class CurrentConfigurationTabComponent : ComponentBase
{
    [Parameter]
    public ConfigurationReportDto Model { get; set; }

    [Parameter]
    public EventCallback OnOverridesChanged { get; set; }

    [Inject]
    public IVanillaApiClient VanillaApi { get; set; }

    protected EditOverridesDialogComponent EditOverridesDialog { get; set; }
    protected HashSet<string> ExpandedFeatures { get; } = new ();
    protected bool ShowOnlyFeaturesWithOverrides { get; set; }
    protected bool ShowOnlyConfigsForCurrentContext { get; set; } = true;
    protected bool IsClearingOverrides { get; set; }
    protected async Task EditFeatureOverridesAsync(JObject dynaConFeatureJson, JObject overrideFeatureJson, string featureName, string keyName)
    {
        var jsonToEdit = keyName != null
            ? GetAllCurrentValue() ?? GetFirstValueJsonOfKey(dynaConFeatureJson)
            : overrideFeatureJson ?? dynaConFeatureJson;

        await EditOverridesDialog.ShowAsync(jsonToEdit, featureName, keyName);

        JToken GetFirstValueJsonOfKey(JObject featureJson)
        {
            var valuesArray = featureJson?.Get<JObject>(keyName)?.Get<JArray>("Values");

            if (valuesArray != null)
            {
                foreach (var context in Model.CurrentVariationContext)
                {
                    var key = context.Key;
                    var value = context.Value;
                    var matchingObject = valuesArray
                        .FirstOrDefault(obj =>
                        {
                            if (obj is JObject jObj)
                            {
                                var contextObj = jObj["Context"] as JObject;
                                return contextObj != null &&
                                       string.Equals(contextObj[key]?.ToString(), value, StringComparison.OrdinalIgnoreCase);
                            }
                            return false;
                        });

                    if (matchingObject is JObject match && match["Value"] != null)
                    {
                        return match["Value"];
                    }
                }

                var firstObject = valuesArray.FirstOrDefault();
                if (firstObject is JObject first && first["Value"] != null)
                {
                    return first["Value"];
                }
            }
            return null;
        }

        JToken GetAllCurrentValue()
        {
            foreach (var feature in Model.ActiveChangesetFeatures.Where(f =>
                !ShowOnlyFeaturesWithOverrides || (GetFeatureJson(Model.OverridesJson, f.Key) != null)))
            {
                if (feature.Key.Equals(featureName))
                {
                foreach (var config in feature.Value.Where(c => !ShowOnlyConfigsForCurrentContext || c.CurrentlyUsed) )
                {
                    if (config.InstanceJson.ContainsKey(keyName))
                    {
                        return config.InstanceJson[keyName];
                    }
                }
                }
            }
            return null;
        }
    }

    protected async Task SaveOverrides(string featureName, string keyName, JToken overridesJson)
    {
        var url = DiagnosticApiUrls.Configuration.Overrides.GetUrl(featureName, keyName);
        await VanillaApi.PostAsync(url, overridesJson);
        await OnOverridesChanged.InvokeAsync(null);
    }

    protected async Task ClearOverrides(string featureName = null, string keyName = null)
    {
        IsClearingOverrides = true;
        var url = DiagnosticApiUrls.Configuration.Overrides.GetUrl(featureName, keyName);
        await VanillaApi.SendAsync(HttpMethod.Delete, url);
        await OnOverridesChanged.InvokeAsync(null);

        ShowOnlyFeaturesWithOverrides &= Model.OverridesJson.HasValues;
        IsClearingOverrides = false;
    }

    protected static JObject GetFeatureJson(JObject dtoJson, string featureName)
        => dtoJson?.Get<JObject>("Configuration")?.Get<JObject>(featureName);

    protected void OnScrollFromUrlFragment(string featureName)
    {
        ExpandedFeatures.Add(featureName);
        StateHasChanged();
    }
}
