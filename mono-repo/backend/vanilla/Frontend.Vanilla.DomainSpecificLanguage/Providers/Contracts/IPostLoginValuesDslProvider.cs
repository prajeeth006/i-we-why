using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides access to user's post login values.
/// </summary>
[Description(
    "Provides access to user's postlogin values. Disclaimer: Use this wisely. Values are available for 20 minutes after login (the period of distributed cache expiration).")]
public interface IPostLoginValuesDslProvider
{
    /// <summary>
    /// Indicates player's priority.
    /// </summary>
    [Description("Indicates if KYC DE should be shown to user.")]
    bool ShowKycDe { get; }

    /// <summary>
    /// Indicates if MC upgrade should be shown to user.
    /// </summary>
    [Description("Indicates if MC upgrade should be shown to user.")]
    bool ShowMcUpgrade { get; }
}
