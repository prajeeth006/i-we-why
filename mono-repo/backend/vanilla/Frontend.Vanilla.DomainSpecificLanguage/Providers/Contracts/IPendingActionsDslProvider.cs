using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides access to pending actions.
/// </summary>
[Description("Provides access to user's pending actions.")]
public interface IPendingActionsDslProvider
{
    /// <summary>
    /// Indicates if user has at least one action where reaction is needed.
    /// </summary>
    [Description("Indicates if user has at least one action where reaction is needed.")]
    bool HasActionWithReactionNeeded();
}
