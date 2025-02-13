namespace Frontend.Host.Features.Assets.AssetTypes;

/// <summary>
/// Represents a stylesheet asset that is rendered on the entry page.
/// </summary>
public class InlineStylesheetBootstrapAsset : BootstrapAsset
{
    internal string Content { get; }

    /// <summary>
    /// Creates an instance of <see cref="InlineStylesheetBootstrapAsset"/>.
    /// </summary>
    public InlineStylesheetBootstrapAsset(string content)
        : base("Inline")
    {
        Content = content;
    }
}
