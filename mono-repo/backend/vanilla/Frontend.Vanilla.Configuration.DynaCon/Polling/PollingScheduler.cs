using System;
using System.Threading;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Configuration.DynaCon.Polling;

/// <summary>
/// Polls DynaCon service to retrieve some particular data.
/// </summary>
internal interface IPollingScheduler<TJob> : IConfigurationInitializer, IDisposable
    where TJob : IScheduledJob
{
    UtcDateTime? NextPollTime { get; }
}

internal interface IScheduledJob
{
    TimeSpan? GetInterval(DynaConEngineSettings settings);
    void Execute();
}

internal sealed class PollingScheduler<TJob>(DynaConEngineSettings settings, TJob job, ITimerFactory timerFactory, IClock clock, ILogger<PollingScheduler<TJob>> log)
    : IPollingScheduler<TJob>
    where TJob : IScheduledJob
{
    private static readonly string JobName = typeof(TJob).Name;
    private readonly TJob job = job;
    private volatile Tuple<UtcDateTime>? nextPollTime;
    private IDisposable? timer; // Reference must be kept b/c it would get disposed immediately
    private TimeSpan interval;
    private readonly Semaphore isRunningSemaphore = new (initialCount: 1, maximumCount: 1);

    public void Initialize()
    {
        Guard.Assert(timer == null, "Can be started only once.");

        interval = job.GetInterval(settings) ?? TimeSpan.Zero;

        if (interval <= TimeSpan.Zero)
        {
            log.LogInformation("Not starting {job} because it's disabled based on its interval from settings", JobName);

            return;
        }

        // Randomize tick time so that traffic on DynaCon API side is uniform, delay to start up the app asap
        var dueTime = settings.PollingStartupDelay + TimeSpan.FromMilliseconds(RandomGenerator.GetDouble() * interval.TotalMilliseconds);
        log.LogInformation("Started {job} with {interval}", JobName, interval);
        timer = timerFactory.Create(TimerTick, dueTime, interval);

        SetNextPollTimeFromNow(dueTime);
    }

    private void TimerTick()
    {
        SetNextPollTimeFromNow(interval);

        if (!isRunningSemaphore.WaitOne(TimeSpan.Zero))
        {
            log.LogError("Cancelling {job} because previous one is still running. Maybe you should adjust its {interval} in DynaConEngineSettings", JobName, interval);

            return;
        }

        try
        {
            job.Execute();
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed execution of {job}", JobName);
        }
        finally
        {
            isRunningSemaphore.Release();
        }
    }

    private void SetNextPollTimeFromNow(TimeSpan time)
        => nextPollTime = Tuple.Create(clock.UtcNow + time);

    public UtcDateTime? NextPollTime
        => nextPollTime?.Item1;

    public void Dispose()
        => timer?.Dispose();
}
