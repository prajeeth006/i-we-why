using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Values related to the user self exclusion details.
/// </summary>
[Description("Values related to the user self exclusion details.")]
public interface ISelfExclusionDslProvider
{
    /// <summary>
    /// The exclusion category of authenticated user. Empty string in case of anonymous, workflow user or user does not fall under RGclose/Cool-off.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description(
        "The exclusion category of authenticated user. Empty string in case of anonymous, workflow user or user does not fall under RGclose/Cool-off.")]
    Task<string> GetCategoryAsync(ExecutionMode mode);

    /// <summary>
    /// The start date of self exclusion. Empty string for other scenarios.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("The start date of self exclusion. Date is in '" + UserDslProviderConstants.RegistrationDateFormat +
                 "' format. Empty string for other scenarios.")]
    Task<string> GetStartDateAsync(ExecutionMode mode);

    /// <summary>
    /// The end date of self exclusion. Empty string for other scenarios.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("The end date of self exclusion. Date is in '" + UserDslProviderConstants.RegistrationDateFormat +
                 "' format. Empty string for other scenarios.")]
    Task<string> GetEndDateAsync(ExecutionMode mode);
}
