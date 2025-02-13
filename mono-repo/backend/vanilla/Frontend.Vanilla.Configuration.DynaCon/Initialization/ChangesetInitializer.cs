using Frontend.Vanilla.Configuration.DynaCon.Container;

namespace Frontend.Vanilla.Configuration.DynaCon.Initialization;

/// <summary>
/// Initializes changeset according to <see cref="DynaConEngineSettings" />.
/// </summary>
internal sealed class ChangesetInitializer(IConfigurationContainer container, IInitialChangesetLoader loader) : IConfigurationInitializer
{
    public void Initialize()
    {
        var snapshot = loader.GetConfiguration();
        container.SetSnapshot(_ => snapshot);
    }
}
