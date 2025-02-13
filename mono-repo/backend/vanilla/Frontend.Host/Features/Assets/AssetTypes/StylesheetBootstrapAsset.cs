namespace Frontend.Host.Features.Assets.AssetTypes;

/// <summary>
/// Represents lazy loading strategy for stylesheets.
/// </summary>
public enum AssetLazyLoadStrategy
{
    /// <summary>
    /// No lazy loading.
    /// </summary>
    None,

    /// <summary>
    /// Load this style immediately, in non render blocking way with rel=preload. Not applicable for Scripts.
    /// </summary>
    Preload,

    /// <summary>
    /// Lazy load at app start and wait until loaded before resuming bootstrap.
    /// </summary>
    Important,

    /// <summary>
    /// Load this style lazily after app start.
    /// </summary>
    Secondary,

    /// <summary>
    /// Load this style/script later on your own with javascript.
    /// </summary>
    Custom,
}

/// <summary>
/// Represents a stylesheet asset that is rendered on the entry page.
/// </summary>
public class StylesheetBootstrapAsset : BootstrapAsset, ILazyBootstrapAsset
{
    /// <summary>
    /// Lazy load strategy to use.
    /// </summary>
    public AssetLazyLoadStrategy LazyLoad { get; set; }

    /// <summary>
    /// An alias to refer to this style reference from code.
    /// </summary>
    public string? Alias { get; set; }

    /// <summary>
    /// Media query to specify under which media query conditions to use the stylesheet. Can be an alias (like <c>gt</c> or standard media query like <c>screen and (min-width: 123px)</c>).
    /// </summary>
    public string? Media { get; set; }

    /// <summary>
    /// Creates an instance of <see cref="StylesheetBootstrapAsset"/>.
    /// </summary>
    public StylesheetBootstrapAsset(string path)
        : base(path) { }
}

/// <summary>
/// tertert.
/// </summary>
public interface ILazyBootstrapAsset
{
    /// <summary>
    /// Lazy load strategy to use.
    /// </summary>
    AssetLazyLoadStrategy LazyLoad { get; set; }

    /// <summary>
    /// An alias to refer to this style reference from code.
    /// </summary>
    string? Alias { get; set; }

    /// <summary>
    /// Media query to specify under which media query conditions to use the stylesheet. Can be an alias (like <c>gt</c> or standard media query like <c>screen and (min-width: 123px)</c>).
    /// </summary>
    string? Media { get; set; }
}
