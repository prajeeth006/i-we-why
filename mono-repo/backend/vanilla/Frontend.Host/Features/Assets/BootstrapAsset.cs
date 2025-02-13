namespace Frontend.Host.Features.Assets;

/// <summary>
/// Represents an asset that is rendered on the entry page.
/// </summary>
public abstract class BootstrapAsset
{
    /// <summary>
    /// The path to the asset.
    /// </summary>
    internal string Path { get; }

    /// <summary>
    /// Used in subclasses to populate base properties.
    /// </summary>
    protected BootstrapAsset(string path)
    {
        Path = path;
    }
}
