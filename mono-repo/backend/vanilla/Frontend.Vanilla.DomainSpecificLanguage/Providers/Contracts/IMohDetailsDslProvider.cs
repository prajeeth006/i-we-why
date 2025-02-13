using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides access to user's MOH details.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description("Provides access to user's MOH details.")]
public interface IMohDetailsDslProvider
{
    /// <summary>
    /// Indicates user's comment.
    /// </summary>
    [Description("Indicates user's comment.")]
    Task<string> GetCommentsAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's country code.
    /// </summary>
    [Description("Indicates user's country code.")]
    Task<string> GetCountryCodeAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's excl days.
    /// </summary>
    [Description("Indicates user's excl days.")]
    Task<decimal> GetExclDaysAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's primary product code.
    /// </summary>
    [Description("Indicates user's primary product code.")]
    Task<decimal> GetMohPrimaryProductCodeAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's primary reason code.
    /// </summary>
    [Description("Indicates user's primary reason code.")]
    Task<decimal> GetMohPrimaryReasonCodeAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's primary risk band code.
    /// </summary>
    [Description("Indicates user's primary risk band code.")]
    Task<decimal> GetMohPrimaryRiskBandCodeAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's primary tool code.
    /// </summary>
    [Description("Indicates user's primary tool code.")]
    Task<decimal> GetMohPrimaryToolCodeAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's moh score.
    /// </summary>
    [Description("Indicates user's moh score.")]
    Task<decimal> GetMohScoreAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's processed status.
    /// </summary>
    [Description("Indicates user's processed status.")]
    Task<string> GetProcessedAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's vip status.
    /// </summary>
    [Description("Indicates user's vip status.")]
    Task<string> GetVipUserAsync(ExecutionMode mode);
}
