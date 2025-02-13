using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides the deposit limits for the user. Values are negative in case of anonymous user.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description("Provides the deposit limits for the user. Values are negative in case of anonymous user.")]
public interface IDepositLimitsDslProvider
{
    /// <summary>
    /// Get player limits by limit type. Values are negative in case of anonymous user. Possible values for limitType param: DAILY, WEEKLY, MONTHLY.
    /// </summary>
    [Description("Get player limits by limit type. Values are negative in case of anonymous user. Possible values for limitType param: DAILY, WEEKLY, MONTHLY.")]
    Task<decimal> GetAsync(ExecutionMode mode, string limitType);

    /// <summary>
    /// Indicates if specified limit is low according to the configuration <c>https://admin.dynacon.prod.env.works/goto?feature=VanillaFramework.Features.DepositLimits&amp;key=LowThresholds</c>.
    /// Possible values for limitType param: DAILY, WEEKLY, MONTHLY.
    /// Will return false if deposit type is not set.
    /// Example use: DepositLimits.IsLow('WEEKLY').
    /// </summary>
    [ClientSideOnly]
    [Description(
        "Indicates if specified limit is low according to the configuration https://admin.dynacon.prod.env.works/goto?feature=VanillaFramework.Features.DepositLimits&amp;key=LowThresholds."
        + " Possible values for limitType param: DAILY, WEEKLY, MONTHLY."
        + " Will return false if deposit type is not set."
        + " Example use: DepositLimits.IsLow('WEEKLY').")]
    bool IsLow(string limitType);
}
