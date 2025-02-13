using System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers;

/// <summary>
/// Indicates volatily of the value(s) returned by particular DSL provider member.
/// </summary>
[AttributeUsage(AttributeTargets.Property | AttributeTargets.Method | AttributeTargets.Interface)]
public sealed class ValueVolatilityAttribute : Attribute
{
    /// <summary>
    /// Gets the volatily.
    /// </summary>
    public ValueVolatility Volatility { get; }

    /// <summary>
    /// Creates a new instance.
    /// </summary>
    public ValueVolatilityAttribute(ValueVolatility volatility)
        => Volatility = Guard.DefinedEnum(volatility, nameof(volatility));
}

/// <summary>
/// Defines volatility of values provided by DSL providers.
/// </summary>
public enum ValueVolatility
{
    /// <summary>
    /// Value can change between full page requests but doesn't change during lifetime of the single page application.
    /// This guarantees good performance e.g. content is already filtered on server and doesn't even get transferred to client browser.
    /// </summary>
    Server = 0,

    /// <summary>
    /// Value can change anytime thus should be evaluated on client browser in the single page application.
    /// This introduced additional overhead but gives the best user experience.
    /// </summary>
    Client = 1,

    /// <summary>
    /// Value doesn't ever change. It's evaluated already during compilation. Usually it's static configuration value of the app.
    /// This has totally the best performance.
    /// </summary>
    Static = 2,
}
