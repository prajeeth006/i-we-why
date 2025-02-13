using System;
using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Application level configuration values.
/// </summary>
[Description("Application level configuration values")]
public interface IAppDslProvider
{
    /// <summary>
    /// Indicates the current environment.
    /// </summary>
    [ValueVolatility(ValueVolatility.Static)]
    [Description("Indicates the application environment")]
    string Environment { get; }

    /// <summary>
    /// Indicates if the current environment is Production.
    /// </summary>
    [ValueVolatility(ValueVolatility.Static)]
    [Description("Indicates if the current environment is Production")]
    bool IsProduction { get; }

    /// <summary>
    /// Indicates the current label.
    /// </summary>
    [ValueVolatility(ValueVolatility.Server)]
    [Description("Indicates the current label")]
    string Label { get; }

    /// <summary>
    /// Indicates the current product.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("Indicates the current product")]
    string Product { get; }

    /// <summary>
    /// Indicates the default culture.
    /// </summary>
    [Obsolete("Use Culture.Default instead.")]
    [ValueVolatility(ValueVolatility.Static)]
    [Description("Indicates the default culture")]
    string DefaultCulture { get; }

    /// <summary>
    /// Indicates the default culture route token.
    /// </summary>
    [Obsolete("Use Culture.GetUrlToken(Culture.Default) instead.")]
    [ValueVolatility(ValueVolatility.Static)]
    [Description("Indicates the default culture route token")]
    string DefaultCultureToken { get; }

    /// <summary>
    /// Whether the app is running in iframe context.
    /// </summary>
    [Description("Indicates current app context.")]
    [ValueVolatility(ValueVolatility.Client)]
    string Context();

    /// <summary>
    /// Indicates current theme.
    /// </summary>
    [Description("Indicates current theme.")]
    [ValueVolatility(ValueVolatility.Client)]
    string Theme { get; }

    /// <summary>
    /// Indicates platfrom product name.
    /// </summary>
    [Description("Indicates platfrom product name.")]
    [ValueVolatility(ValueVolatility.Server)]
    Task<string> GetPlatformProductNameAsync(ExecutionMode mode);
}
