using System;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.ManipulationService;

/// <summary>
/// Central command for setting all overrides together.
/// </summary>
internal interface ISetAllOverridesJsonCommand
{
    void Set(JObject overridesJson);
}

internal sealed class SetAllOverridesJsonCommand(
    IOverridesStorage overridesStorage,
    IConfigurationContainer configurationContainer,
    IChangesetOverrider changesetOverrider)
    : ISetAllOverridesJsonCommand
{
    public void Set(JObject overridesJson)
    {
        var activeChangeset = configurationContainer.GetSnapshot().ActiveChangeset;

        try
        {
            changesetOverrider.Override(activeChangeset, overridesJson);
        }
        catch (Exception ex)
        {
            var message = $"Specified config overrides can't be applied because they produce a failed changeset when overriding active changeset {activeChangeset.Id}.";

            throw new Exception(message, ex);
        }

        overridesStorage.Set(overridesJson);
    }
}
