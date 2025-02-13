using System;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.DependencyInjection.ExternallyManaged;

/// <summary>
/// Externally manages value injected to transient services created on demand.
/// </summary>
internal sealed class ExternalManager<TValue>
    where TValue : class
{
    private TValue? value;

    public ExternalManager(TValue? value = null)
        => this.value = value;

    public TValue Value
    {
        get => value ?? throw new InvalidOperationException($"Value wasn't set yet. Maybe you are missing scope and injecting {typeof(TValue)} to a singleton." +
                                                            CallerInfo.Get());
        set => this.value = Guard.NotNull(value, nameof(value));
    }
}
