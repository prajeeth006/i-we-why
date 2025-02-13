using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides Tier values from PosAPI.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description("Provides logged in user mlife tier values from PosAPI.")]
public interface ILoyalityProfileDslProvider
{
    /// <summary>
    /// Gets the user mlifeNo value.
    /// </summary>
    [Description("Gets mlifeNo return decimal")]
    Task<decimal> GetMlifeNoAsync(ExecutionMode mode);

    /// <summary>
    /// Gets the user tier value.
    /// </summary>
    [Description("Gets mlife tier return string")]
    Task<string> GetMlifeTierAsync(ExecutionMode mode);

    /// <summary>
    /// Gets the user tier description value.
    /// </summary>
    [Description("Gets tier description return string")]
    Task<string> GetMlifeTierDescAsync(ExecutionMode mode);

    /// <summary>
    /// Gets the user tier credits value.
    /// </summary>
    [Description("Gets tier credits return decimal")]
    Task<decimal> GetMlifetierCreditsAsync(ExecutionMode mode);
}
