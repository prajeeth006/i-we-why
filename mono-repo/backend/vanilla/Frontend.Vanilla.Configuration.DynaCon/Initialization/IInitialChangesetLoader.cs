using Frontend.Vanilla.Configuration.DynaCon.Container;

namespace Frontend.Vanilla.Configuration.DynaCon.Initialization;

/// <summary>
/// Loads initial configuration on startup.
/// </summary>
internal interface IInitialChangesetLoader
{
    IConfigurationSnapshot GetConfiguration(bool maskSensitiveData = false);
}
