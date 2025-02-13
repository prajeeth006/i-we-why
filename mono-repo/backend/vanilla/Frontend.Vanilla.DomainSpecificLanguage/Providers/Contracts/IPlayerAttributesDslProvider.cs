using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides values for acknowledged and VIP player attributes. Values are string or empty string in case of anonymous user or if value is not returned by the API.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description(
    "Provides values for acknowledged and VIP player attributes. Values are string or empty string in case of anonymous user or if value is not returned by the API.")]
public interface IPlayerAttributesDslProvider
{
    /// <summary>Get attribute value for acknowledged player by key. The key is case-insensitive. Returns empty string if there is no value for the given key.</summary>
    [Description("Get attribute value for acknowledged player by key. The key is case-insensitive. Returns empty string if there is no value for the given key.")]
    Task<string> GetAcknowledgedAsync(ExecutionMode mode, string key);

    /// <summary>Get attribute value for VIP player by key. The key is case-insensitive. Returns empty string if there is no value for the given key.</summary>
    [Description("Get attribute value for VIP player by key. The key is case-insensitive. Returns empty string if there is no value for the given key.")]
    Task<string> GetVipAsync(ExecutionMode mode, string key);
}
