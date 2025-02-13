using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.ManipulationService;
using Frontend.Vanilla.Core.Reflection.Facade;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;

/// <summary>
/// Facade for manipulating configuration overrides. Their type is dependant on the configuration.
/// </summary>
internal interface IConfigurationOverridesService
{
    [DelegateTo(typeof(IOverridesStorage), nameof(IOverridesStorage.Get))]
    JObject GetJson();

    [DelegateTo(typeof(ISetAllOverridesJsonCommand), nameof(ISetAllOverridesJsonCommand.Set))]
    void SetJson(JObject overridesJson);

    [DelegateTo(typeof(IClearOverridesCommand), nameof(IClearOverridesCommand.Clear))]
    void Clear();
}
