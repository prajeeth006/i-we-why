using System.Net;

namespace Frontend.Vanilla.Core.Net;

/// <summary>
/// Logic for resolution of client IP address.
/// </summary>
public interface IClientIPResolver
{
    /// <summary>
    /// Resolves IP host address of the remote client according to Vanilla setup and deployment.
    /// Tries to get public IP. If not available then gets first private one according the rules.
    /// </summary>
    IPAddress Resolve();
}

internal sealed class LoopbackIpResolver : IClientIPResolver
{
    public IPAddress Resolve() => IPAddress.Loopback;
}
