using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides properties of the user's browser.
/// </summary>
[Description("Provides properties of the user's browser.")]
[ValueVolatility(ValueVolatility.Client)]
public interface IBrowserDslProvider
{
    /// <summary>
    /// The name of the user's browser, if available. Examples: Chrome, InternetExplorer, Safari.
    /// </summary>
    [Description("The name of the user's browser, if available. Examples: Chrome, InternetExplorer, Safari")]
    Task<string> GetNameAsync(ExecutionMode mode);

    /// <summary>
    /// The version of the user's browser, if available. Examples: 48.0, 9.0.
    /// </summary>
    [Description("The version of the user's browser, if available. Examples: 48.0, 9.0")]
    Task<string> GetVersionAsync(ExecutionMode mode);

    /// <summary>
    /// The major version of the user's browser, if available. Examples: 48, 9.
    /// </summary>
    [Description("The major version of the user's browser, if available. Examples: 48, 9")]
    Task<decimal> GetMajorVersionAsync(ExecutionMode mode);

    /// <summary>
    /// Whether the app is running in standalone mode (e.g. launched from home screen).
    /// </summary>
    [Description("Whether the app is running in standalone mode (e.g. launched from home screen).")]
    [ClientSideOnly]
    bool IsStandaloneApp();
}
