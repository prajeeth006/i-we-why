using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.ClientConfig;

/// <summary>Provides client-side app configuration.</summary>
public interface IClientConfigProvider
{
    /// <summary>Gets the name under which the configuration will be accessible on the client.</summary>
    Identifier Name { get; }

    /// <summary>Gets the type of client configuration.</summary>
    ClientConfigType Type { get; }

    /// <summary>Returns the instance of client configuration.</summary>
    Task<object> GetClientConfigAsync(CancellationToken cancellationToken);
}

/// <summary>Specifies type of <see cref="IClientConfigProvider" />.</summary>
public enum ClientConfigType
{
    /// <summary>Client config that will be loaded before angular application is bootstrapped. Default behavior.</summary>
    Eager,

    /// <summary>Client config that will be loaded on-demand when requested by name.</summary>
    Lazy,
}
