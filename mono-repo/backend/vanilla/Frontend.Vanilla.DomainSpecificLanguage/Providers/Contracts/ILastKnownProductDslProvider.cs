using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Last known product DSL provider.
/// </summary>
[Description("Last known product DSL provider.")]
[ValueVolatility(ValueVolatility.Client)]
public interface ILastKnownProductDslProvider
{
    /// <summary>
    /// Indicates last known product name.
    /// </summary>
    [Description("Indicates the last known product name.")]
    string Name { get; }

    /// <summary>
    /// Indicates previous product name.
    /// </summary>
    [Description("Indicates the previous product name.")]
    string Previous { get; }

    /// <summary>
    /// Indicates the platform product id.
    /// </summary>
    [Description("Indicates the platform product id.")]
    string PlatformProductId { get; }

    /// <summary>
    /// Indicates the current label.
    /// </summary>
    [Description("Indicates the last known product url.")]
    string Url { get; }
}
