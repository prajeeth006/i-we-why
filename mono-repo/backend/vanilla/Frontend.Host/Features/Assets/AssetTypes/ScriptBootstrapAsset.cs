namespace Frontend.Host.Features.Assets.AssetTypes;

/// <summary>
/// Defines ES module option for the asset.
/// </summary>
public enum ScriptBootstrapAssetModule
{
    /// <summary>
    /// Default value, does nothing.
    /// </summary>
    Unspecified,

    /// <summary>
    /// Indicates that this asset is an ES module (type="module").
    /// </summary>
    Module,

    /// <summary>
    /// Indicates that this asset is not an ES module (nomodule).
    /// </summary>
    NoModule,
}

/// <summary>
/// Represents a script asset that is rendered on the entry page.
/// </summary>
public class ScriptBootstrapAsset : BootstrapAsset, ILazyBootstrapAsset
{
    /// <summary>
    /// Lazy load strategy to use.
    /// </summary>
    public AssetLazyLoadStrategy LazyLoad { get; set; }

    /// <summary>
    /// Indicates whether the script should be rendered in the head, rather than at the bottom of the body.
    /// </summary>
    public bool IsHeadScript { get; set; }

    /// <summary>
    /// Indicates whether the asset is a module for purposes of differential loading.
    /// </summary>
    public ScriptBootstrapAssetModule Module { get; set; }

    /// <summary>
    /// An alias to refer to this script reference from code.
    /// </summary>
    public string? Alias { get; set; }

    /// <summary>
    /// Media query to specify under which media query conditions to use the script. Can be an alias (like <c>gt</c> or standard media query like <c>screen and (min-width: 123px)</c>).
    /// </summary>
    public string? Media { get; set; }

    /// <summary>
    /// Creates an instance of <see cref="ScriptBootstrapAsset"/>.
    /// </summary>
    public ScriptBootstrapAsset(string path)
        : base(path) { }
}
