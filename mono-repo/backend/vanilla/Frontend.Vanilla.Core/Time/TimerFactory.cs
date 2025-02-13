using System;
using System.Threading;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Time;

/// <summary>
/// Factory for timer which makes unit testing easier.
/// </summary>
internal interface ITimerFactory
{
    IDisposable Create(Action action, TimeSpan dueTime, TimeSpan period);
}

internal sealed class TimerFactory : ITimerFactory
{
    public IDisposable Create(Action action, TimeSpan dueTime, TimeSpan period)
    {
        Guard.NotNull(action, nameof(action));
        Guard.GreaterOrEqual(dueTime, TimeSpan.Zero, nameof(dueTime));
        Guard.GreaterOrEqual(period, TimeSpan.Zero, nameof(period));

        if (dueTime <= TimeSpan.Zero && period <= TimeSpan.Zero)
            throw new ArgumentException($"A least on of {nameof(dueTime)} and {nameof(period)} must be greater than TimeSpan.Zero");

        return new Timer(_ => action(), null, dueTime, period);
    }
}
