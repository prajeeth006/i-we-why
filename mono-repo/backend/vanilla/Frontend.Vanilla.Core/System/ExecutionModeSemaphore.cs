using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Patterns;

namespace Frontend.Vanilla.Core.System;

/// <summary>
/// Detects async-sync deadlock in addition to underlying <see cref="SemaphoreSlim" />:
/// 1) Given a single thread, execute multiple operations in parallel e.g. <see cref="Task.WhenAll(IEnumerable{Task})" />.
/// 2) First operation is <see cref="ExecutionMode.Async" />, acquires the semaphore then on await suspends its execution b/c it's real async.
/// 3) Second operation is <see cref="ExecutionMode.Sync" />, it waits for the semaphore but only thread that can release it is this one hence deadlock.
/// </summary>
internal sealed class ExecutionModeSemaphore
{
    private readonly SemaphoreSlim inner = new SemaphoreSlim(initialCount: 1, maxCount: 1);
    private readonly string id = "Van:SemaphoreId:" + Guid.NewGuid();

    public async Task<IDisposable> WaitDisposableAsync(ExecutionMode mode, IDictionary<object, Lazy<object?>> syncItems)
    {
        if (mode.AsyncCancellationToken != null)
            syncItems.TryAdd(id, new Lazy<object?>(1));
        else if (syncItems.ContainsKey(id))
            throw new InvalidOperationException("Failed to synchronously wait on semaphore because it would result in a deadlock"
                                                + " because it's already asynchronously entered by same async flow (can be same thread). This is possible due to Task.WhenAll() called on top."
                                                + " To fix this issue, make this second call async too: " + new StackTrace(fNeedFileInfo: true));

        var enteredLock = await inner.WaitDisposableAsync(mode);

        return new DisposableAction(() =>
        {
            syncItems.Remove(id);
            enteredLock.Dispose();
        });
    }
}
