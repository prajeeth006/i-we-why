using System.ComponentModel;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System;
using JetBrains.Annotations;

namespace Frontend.Host.Features.Assets.AssetTypes;

/// <summary>
/// Represents relation attribute to be set on an asset's link tag.
/// </summary>
public enum PreRelation
{
    /// <summary>
    /// Default. If chosen, no link tag will be emitted for the asset.
    /// </summary>
    Off,

    /// <summary>
    /// Resolves the DNS for the asset.
    /// </summary>
    /// <remarks>Used for (Sub-)Domain, URL</remarks>
    [Description("dns-prefetch")]
    DnsPrefetch,

    /// <summary>
    /// Resolves the DNS, TCP, TLS for the asset.
    /// </summary>
    /// <remarks>Used for (Sub-)Domain, URL</remarks>
    PreConnect,

    /// <summary>
    /// Load the asset with low priority in the browser cache (rel=prefetch).
    /// </summary>
    /// <remarks>Used for CSS, JS, Image</remarks>
    Prefetch,

    /// <summary>
    /// Load the asset with high priority in the browser cache (rel=subresource).
    /// </summary>
    /// <remarks>Used for CSS, JS, Image</remarks>
    Subresource,

    /// <summary>
    /// Load the asset with high priority in the browser cache (rel=preload, experimental/working draft).
    /// </summary>
    Preload,

    /// <summary>
    /// Load the asset plus all attached resources in the browser cache (rel=prerender) and render the page at the same time.
    /// </summary>
    /// <remarks>Used for URL, CSS, JS, Image</remarks>
    Prerender,
}

/// <summary>
/// Represents a link html to prefetch an asset preemptively and cache the target resource as it is likely to be required for a follow-up navigation.
/// </summary>
public class PreBootstrapAsset : BootstrapAsset
{
    /// <summary>
    /// Optional value to set on the "as" attribute of the asset's link tag.
    /// </summary>
    public string? As { get; set; }

    /// <summary>
    /// Relation attribute to be set on the asset's link tag.
    /// </summary>
    /// <remarks>Asset link will not be rendered if set to <see cref="PreRelation.Off"/>.</remarks>
    public PreRelation Relation { get; set; }

    /// <summary>
    /// Optional value to set on the "type" attribute of the asset's link tag.
    /// </summary>
    public string? Type { get; set; }

    /// <summary>
    /// Optional, media query to set on the asset's link tag.
    /// </summary>
    public string? Media { get; set; }

    /// <summary>
    /// Optional script to be executed when the asset fires the on load event.
    /// </summary>
    /// <remarks>Use in combination with rel=preload or rel=prefetch to change the rel attribute using javascript.</remarks>
    public string? Onload { get; set; }

    /// <summary>
    /// Creates an instance of <see cref="PreBootstrapAsset"/>.
    /// </summary>
    public PreBootstrapAsset(string path)
        : base(path) { }
}

internal static class PreRelationExtensions
{
    private static readonly IReadOnlyDictionary<PreRelation, string> Cache
        = Enum<PreRelation>.Values.ToDictionary(t => t, t =>
        {
            var attr = typeof(PreRelation).GetField(t.ToString())?.Get<DescriptionAttribute>();

            return attr?.Description ?? t.ToString().ToLowerInvariant();
        });

    [NotNull]
    public static string GetValue(this PreRelation type)
        => Cache[type];
}
