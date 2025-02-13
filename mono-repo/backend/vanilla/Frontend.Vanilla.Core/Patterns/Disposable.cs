using System;
using System.Threading;

namespace Frontend.Vanilla.Core.Patterns;

/// <summary>
/// Base class for implementing the disposable pattern easily and thread-safe.
/// </summary>
/// <remarks>
/// Not suitable if you also need control over finalization (e.g. for dealing with unmanaged resources).
/// </remarks>
public abstract class Disposable : IDisposable
{
    private readonly Lock disposalLock = new ();
    private volatile bool isDisposed;

    /// <summary>
    /// Indicates wheter the instance has already been disposed.
    /// </summary>
    public bool IsDisposed => isDisposed;

    /// <summary>
    /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
    /// </summary>
    public void Dispose()
    {
        if (!isDisposed)
        {
            lock (disposalLock)
            {
                if (!isDisposed)
                {
                    OnDispose();
                    isDisposed = true;

                    return;
                }
            }
        }

        throw new ObjectDisposedException(ToString());
    }

    /// <summary>
    /// Implement this method to handle managed resource disposal.
    /// </summary>
    /// <remarks>
    /// Will be called only once even if clients call more than once, even from different threads.
    /// </remarks>
    protected abstract void OnDispose();
}
