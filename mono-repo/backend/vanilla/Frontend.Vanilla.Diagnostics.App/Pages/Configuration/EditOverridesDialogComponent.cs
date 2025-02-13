using System;
using System.Threading.Tasks;
using BlazorStrap.V4;
using Frontend.Vanilla.Diagnostics.App.Infrastructure;
using Microsoft.AspNetCore.Components;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Diagnostics.App.Pages.Configuration;

public abstract class EditOverridesDialogComponent : ComponentBase
{
    [Parameter]
    public EventCallback<(string FeatureName, string KeyName, JToken OverridesJson)> OnSaveOverrides { get; set; }

    protected BSModal Modal { get; set; }
    protected string FeatureName { get; private set; }
    protected string KeyName { get; private set; }
    protected bool IsSaving { get; private set; }

    private string jsonString;
    protected string JsonError { get; private set; }

    protected string JsonString
    {
        get => jsonString;
        set
        {
            var validation = KeyName != null
                ? (Func: s => JToken.Parse(s), Description: "value")
                : (Func: new Action<string>(s => JObject.Parse(s)), Description: "object");

            try
            {
                validation.Func(jsonString = value);
                JsonError = null;
            }
            catch (Exception ex)
            {
                JsonError = $"Invalid JSON {validation.Description}: {ex.Message}";
            }
        }
    }

    public async Task ShowAsync(JToken overrideJson, string featureName = null, string keyName = null)
    {
        jsonString = overrideJson.DeepClone().ToString(Formatting.Indented);
        JsonError = null;
        FeatureName = featureName;
        KeyName = keyName;
        IsSaving = false;
        await Modal.ShowAsync();
    }

    protected async Task OnSaveOverridesClicked()
    {
        try
        {
            IsSaving = true;
            var json = JToken.Parse(jsonString);
            await OnSaveOverrides.InvokeAsync((FeatureName, KeyName, json));
            await Modal.HideAsync();
        }
        catch (Exception ex)
        {
            JsonError = ex is ApiException apiEx ? apiEx.Message : ex.ToString();
            IsSaving = false;
        }
    }
}
