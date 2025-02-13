using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Patterns;

namespace Frontend.Vanilla.Core.System;

/// <summary>
/// Extension methods for locks and semaphores.
/// </summary>
internal static class LockExtensions
{
    public static Task<IDisposable> WaitDisposableAsync(this SemaphoreSlim semaphore, ExecutionMode mode)
        => mode.AsyncCancellationToken != null
            ? semaphore.WaitDisposableAsync(mode.AsyncCancellationToken.Value)
            : Task.FromResult(semaphore.WaitDisposable());

    public static async Task<IDisposable> WaitDisposableAsync(this SemaphoreSlim semaphore, CancellationToken cancellationToken)
    {
        await semaphore.WaitAsync(cancellationToken);

        return new DisposableAction(() => semaphore.Release());
    }

    public static IDisposable WaitDisposable(this SemaphoreSlim semaphore)
    {
        semaphore.Wait();

        return new DisposableAction(() => semaphore.Release());
    }

    public static IDisposable TakeRead(this ReaderWriterLockSlim @lock)
    {
        @lock.EnterReadLock();

        return new DisposableAction(@lock.ExitReadLock);
    }

    public static IDisposable TakeWrite(this ReaderWriterLockSlim @lock)
    {
        @lock.EnterWriteLock();

        return new DisposableAction(@lock.ExitWriteLock);
    }
}
