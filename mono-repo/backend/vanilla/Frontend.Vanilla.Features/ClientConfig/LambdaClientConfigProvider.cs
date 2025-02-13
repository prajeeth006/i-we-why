using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.ClientConfig;

/// <summary>
/// A helper class for client config providers.
/// </summary>
public class LambdaClientConfigProvider : IClientConfigProvider
{
    internal static readonly object DisabledConfig = new JRaw(@"{""isEnabled"":false}");

    /// <inheritdoc />
    public Identifier Name { get; }

    /// <inheritdoc />
    public virtual ClientConfigType Type => ClientConfigType.Eager;

    private readonly Func<CancellationToken, Task<object>> configFactory;

    /// <summary>Create a provider that get the configuration asynchronously.</summary>
    public LambdaClientConfigProvider(string name, Func<CancellationToken, Task<object>> configFactory)
    {
        Name = new Identifier(name);
        this.configFactory = Guard.NotNull(configFactory, nameof(configFactory));
    }

    /// <summary>Create a provider that get the configuration synchronously.</summary>
    public LambdaClientConfigProvider(string name, Func<object> configFactory)
        : this(name, _ => Task.FromResult(configFactory())) { }

    /// <inheritdoc />
    public Task<object> GetClientConfigAsync(CancellationToken cancellationToken)
        => configFactory(cancellationToken);
}
