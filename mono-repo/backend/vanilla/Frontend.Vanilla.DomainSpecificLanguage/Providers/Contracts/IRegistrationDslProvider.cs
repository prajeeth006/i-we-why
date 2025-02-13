using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Values related to the user registration info.
/// </summary>
[Description("Values related to the user registration info.")]
public interface IRegistrationDslProvider
{
    /// <summary>
    /// The registration date of authenticated or workflow user. Empty string for anonymous user.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("The registration date of authenticated or workflow user. Date is in '" + RegistrationDslProviderConstants.RegistrationDateFormat +
                 "' format. Empty string for anonymous user.")]
    Task<string> GetDateAsync(ExecutionMode mode);

    /// <summary>
    /// The number of days elapsed from the registration date of authenticated or workflow user. Negative number for anonymous user.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("The number of days elapsed from the registration date of authenticated or workflow user. Negative number for anonymous user.")]
    Task<decimal> GetDaysRegisteredAsync(ExecutionMode mode);
}

internal static class RegistrationDslProviderConstants
{
    public const string RegistrationDateFormat = "yyyy-MM-dd HH:mm:ss";
}
