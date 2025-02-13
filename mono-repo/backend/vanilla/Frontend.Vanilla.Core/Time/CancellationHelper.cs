using System;
using System.Threading;
using Frontend.Vanilla.Core.Patterns;

namespace Frontend.Vanilla.Core.Time;

/// <summary>
/// Helps with cancellation in unit tests because <see cref="CancellationTokenSource" /> uses a timer
/// which takes actual time to get called and sometimes it even doesn't get called at all because it runs on background esp. on overlaoded machine.
/// </summary>
internal interface ICancellationHelper
{
    ICancellation CancelAfter(TimeSpan delay, CancellationToken tokenToLink = default);
}

internal interface ICancellation : IDisposable
{
    CancellationToken Token { get; }
}

internal sealed class CancellationHelper : ICancellationHelper
{
    public ICancellation CancelAfter(TimeSpan delay, CancellationToken tokenToLink)
    {
        var source = new CancellationTokenSource(delay);
        var registration = tokenToLink.Register(source.Cancel);

        return new Cancellation(source.Token, () =>
        {
            registration.Dispose(); // Dispose b/c tokenToLink references cts = memory leak
            source.Dispose();
        });
    }

    private sealed class Cancellation(CancellationToken token, Action disposeAction) : DisposableAction(disposeAction), ICancellation
    {
        public CancellationToken Token { get; } = token;
    }
}
