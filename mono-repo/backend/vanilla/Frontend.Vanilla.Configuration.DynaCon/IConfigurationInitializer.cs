namespace Frontend.Vanilla.Configuration.DynaCon;

/// <summary>
/// Initializes the configuration engine by loading changeset.
/// </summary>
public interface IConfigurationInitializer
{
    /// <summary>
    /// Initializes the configuration.
    /// </summary>
    void Initialize();
}
