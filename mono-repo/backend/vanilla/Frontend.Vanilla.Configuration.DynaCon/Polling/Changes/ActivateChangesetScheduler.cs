using System;
using System.Collections.Concurrent;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Configuration.DynaCon.Polling.Changes;

internal interface IActivateChangesetScheduler : IDisposable
{
    void ScheduleActivation(IValidChangeset changeset);
}

internal sealed class ActivateChangesetScheduler(
    Func<IValidChangeset, IActivateChangesetJob> jobFactory,
    ITimerFactory timerFactory,
    IClock clock,
    ILogger<ActivateChangesetScheduler> log)
    : IActivateChangesetScheduler
{
    private readonly ConcurrentDictionary<IValidChangeset, IDisposable> timers = new ();
    public static readonly TimeSpan GracePeriod = TimeSpan.FromSeconds(1);

    public void ScheduleActivation(IValidChangeset changeset)
    {
        Guard.Greater(changeset.ValidFrom.Value, clock.UtcNow.Value, nameof(changeset), "ValidFrom must be > clock.UtcNow");
        timers.GetOrAdd(changeset, CreateTimer);
    }

    private IDisposable CreateTimer(IValidChangeset changeset)
    {
        var job = jobFactory(changeset);

        return timerFactory.Create(
            action: () =>
            {
                try
                {
                    job.Execute();
                }
                catch (Exception ex)
                {
                    log.LogError(ex, "Failed executing changeset activation timer");
                }

                RemoveAndDisposeAssociatedTimer(changeset);
            },
            dueTime: changeset.ValidFrom - clock.UtcNow + GracePeriod,
            period: TimeSpan.Zero);
    }

    public void Dispose()
        => timers.Values.ToList().Each(t => t.Dispose());

    private void RemoveAndDisposeAssociatedTimer(IValidChangeset changeset)
    {
        try
        {
            if (timers.TryRemove(changeset, out var timer))
                timer.Dispose();
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed disposing the timer");
        }
    }
}
