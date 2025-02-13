using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Core.Ioc;

/// <summary>
/// Simple implementation of <see cref="ICurrentContextAccessor" /> that stores items statically and allows explicit switch by the caller.
/// </summary>
internal interface IStaticContextManager
{
    Task SwitchContextAsync(CancellationToken cancellationToken);
}

internal sealed class StaticContextManager(IEnumerable<ICurrentContextSwitchHandler> switchHandlers, ICurrentContextAccessor currentContextAccessor)
    : IStaticContextManager
{
    private readonly IReadOnlyList<ICurrentContextSwitchHandler> switchHandlers = switchHandlers.ToList();
    private readonly StaticContextAccessor currentContextAccessor = currentContextAccessor as StaticContextAccessor
                                                                    ?? throw new Exception(
                                                                        $"{typeof(IStaticContextManager)} can be used only when registered {typeof(ICurrentContextAccessor)} is {typeof(StaticContextAccessor)} but it's {currentContextAccessor.GetType()}.");

    public async Task SwitchContextAsync(CancellationToken cancellationToken)
    {
        await Task.WhenAll(switchHandlers.ConvertAll(h => h.OnContextEndAsync(cancellationToken)));

        currentContextAccessor.Items = new ConcurrentDictionary<object, Lazy<object?>>(); // Actual switch

        await Task.WhenAll(switchHandlers.ConvertAll(h => h.OnContextBeginAsync(cancellationToken)));
    }
}
