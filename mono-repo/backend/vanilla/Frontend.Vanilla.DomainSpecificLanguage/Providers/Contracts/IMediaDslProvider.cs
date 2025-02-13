using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Evaulates media queries on the device.
/// </summary>
[Description("Evaulates media queries on the device.")]
[ValueVolatility(ValueVolatility.Client)]
[ClientSideOnly]
public interface IMediaDslProvider
{
    /// <summary>
    /// Evaluates a media query against the current screen. See the list of possible queries (use the alias as the query parameter): https://github.com/angular/flex-layout/wiki/Responsive-API#mediaqueries-and-aliases.
    /// </summary>
    [Description(
        "Evaluates a media query against the current screen. See the list of possible queries (use the alias as the query parameter): https://github.com/angular/flex-layout/wiki/Responsive-API#mediaqueries-and-aliases.")]
    bool IsActive(string query);

    /// <summary>
    /// The orientation of the device.
    /// </summary>
    [Description("The orientation of the device.")]
    string GetOrientation();
}
