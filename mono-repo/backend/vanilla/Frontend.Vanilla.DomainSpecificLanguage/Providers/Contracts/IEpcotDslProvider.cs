using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides information about Epcot features.
/// </summary>
[Description("Provides information about Epcot features.")]
[ValueVolatility(ValueVolatility.Client)]
public interface IEpcotDslProvider
{
    /// <summary>
    /// Indicates if the Epcot feature is enabled.
    /// FeatureName is case-insensitive. Possible values: Header or AccountMenu.
    /// </summary>
    [Description(
        "Indicates if the Epcot feature is enabled." +
        " FeatureName is case-insensitive. Possible values: Header or AccountMenu.")]
    bool IsEnabled(string featureName);
}
