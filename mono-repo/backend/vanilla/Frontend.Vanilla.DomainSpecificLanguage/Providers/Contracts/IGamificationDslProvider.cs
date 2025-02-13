using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides the gamification coin balance.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description("Provides the gamification coin balance.")]
public interface IGamificationDslProvider
{
    /// <summary>
    /// Get coins balance.
    /// </summary>
    [Description("Get coins balance.")]
    [ClientSideOnly]
    string CoinsBalance();
}
