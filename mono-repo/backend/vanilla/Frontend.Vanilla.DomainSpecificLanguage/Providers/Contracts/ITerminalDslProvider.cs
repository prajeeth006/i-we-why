using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides access to retail's context info.
/// </summary>
[Description("Provides access to retail's context info.")]
[ValueVolatility(ValueVolatility.Client)]
public interface ITerminalDslProvider
{
    /// <summary>
    /// Indicates terminal ID.
    /// </summary>
    [Description("Indicates terminal ID.")]
    string TerminalId { get; }

    /// <summary>
    /// Gets status.
    /// </summary>
    [Description("Gets status.")]
    Task<string> GetStatusAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates terminal resolution.
    /// </summary>
    [Description("Gets terminal resolution.")]
    Task<string> GetResolutionAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates terminal IP address.
    /// </summary>
    [Description("Gets terminal IP address.")]
    Task<string> GetIpAddressAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates terminal status.
    /// </summary>
    [Description("Gets terminal lock status.")]
    Task<string> GetLockStatusAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates terminal MAC ID.
    /// </summary>
    [Description("Gets terminal MAC ID.")]
    Task<string> GetMacIdAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates terminal status.
    /// </summary>
    [Description("Gets terminal status.")]
    Task<string> GetTerminalStatusAsync(ExecutionMode mode);

    /// <summary>
    /// Gets Terminal type.
    /// </summary>
    [Description("Gets Terminal type.")]
    Task<string> GetTypeAsync(ExecutionMode mode);

    /// <summary>
    /// Gets terminal volume.
    /// </summary>
    [Description("Gets terminal volume.")]
    Task<string> GetVolumeAsync(ExecutionMode mode);

    /// <summary>
    /// Gets terminal account name.
    /// </summary>
    [Description("Gets terminal account name.")]
    Task<string> GetAccountNameAsync(ExecutionMode mode);

    /// <summary>
    /// Gets terminal customer ID.
    /// </summary>
    [Description("Gets terminal customer ID.")]
    Task<string> GetCustomerIdAsync(ExecutionMode mode);
}
