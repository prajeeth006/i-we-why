using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides generic access to Counter cookies.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description("Provides access to counter value.")]
public interface ICounterDslProvider
{
    /// <summary>
    /// Gets the value of the counter cookie with given name. Name is case-insensitive.
    /// </summary>
    [Description("Gets the value of the counter cookie with given name. Name is case-insensitive.")]
    decimal Get(string name);

    /// <summary>
    /// Increments the value of the counter with given name. Name is case-insensitive.
    /// </summary>
    [Description("Increments the value of the counter with given name. Name is case-insensitive.")]
    void Increment(string name, decimal expiration);
}
