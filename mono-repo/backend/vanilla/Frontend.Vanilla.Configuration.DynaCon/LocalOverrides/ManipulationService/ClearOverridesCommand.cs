using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.ManipulationService;

internal interface IClearOverridesCommand
{
    void Clear();
}

internal sealed class ClearOverridesCommand(IOverridesStorage storage) : IClearOverridesCommand
{
    public void Clear()
        => storage.Set(new JObject());
}
