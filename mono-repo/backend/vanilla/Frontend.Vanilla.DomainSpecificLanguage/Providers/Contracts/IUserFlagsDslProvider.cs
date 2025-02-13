using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides user flags of authenticated user obtained from PosAPI service. Values are string or empty string in case of anonymous user or if value is not return from PosAPI.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description(
    "Provides user flags of authenticated user obtained from PosAPI service. Values are string or empty string in case of anonymous user or if value is not returned from PosAPI.")]
public interface IUserFlagsDslProvider
{
    /// <summary>Gets the user flag value for the specified flag name.</summary>
    [Description("Gets the user flag value for the specified flag name. Name is case-insensitive. Gets empty string if there is no user flag with given name.")]
    Task<string> GetAsync(ExecutionMode mode, string name);

    /// <summary>Check if reason code(s) exists in the user flags.</summary>
    [Description("Check if reason code(s) exists in the user flags. reasonCodes are case-insensitive.")]
    Task<bool> HasReasonCodeAsync(ExecutionMode mode, string reasonCodes);
}
