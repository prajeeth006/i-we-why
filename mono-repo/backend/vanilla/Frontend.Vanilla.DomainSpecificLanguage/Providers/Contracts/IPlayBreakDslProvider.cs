using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides the play break status of the user.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description("Provides the play break status of the user.")]
public interface IPlayBreakDslProvider
{
    /// <summary>
    /// Whether play break is active for the user.
    /// </summary>
    [Description("Whether play break is active for the user.")]
    [ClientSideOnly]
    bool IsActive();

    /// <summary>
    /// Get play break type for the user.
    /// </summary>
    [Description("Get play break type for the user.")]
    [ClientSideOnly]
    string BreakType();

    /// <summary>
    /// Get play break end time.
    /// </summary>
    [Description("Get play break end time.")]
    [ClientSideOnly]
    string EndDate();
}
