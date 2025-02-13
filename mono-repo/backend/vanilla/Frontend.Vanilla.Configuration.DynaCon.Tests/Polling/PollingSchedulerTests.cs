using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Polling;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Polling;

public sealed class PollingSchedulerTests
{
    private IPollingScheduler<IFooJob> target;
    private DynaConEngineSettings settings;
    private Mock<IFooJob> job;
    private Mock<ITimerFactory> timerFactory;
    private TestClock clock;
    private TestLogger<PollingScheduler<IFooJob>> log;

    private Mock<IDisposable> timer;
    private Action timerTick;
    private TimeSpan testInterval;

    public PollingSchedulerTests()
    {
        settings = TestSettings.Get(s => s.PollingStartupDelay = TimeSpan.FromSeconds(77));
        job = new Mock<IFooJob>();
        timerFactory = new Mock<ITimerFactory>();
        clock = new TestClock();
        log = new TestLogger<PollingScheduler<IFooJob>>();
        target = new PollingScheduler<IFooJob>(settings, job.Object, timerFactory.Object, clock, log);

        timer = new Mock<IDisposable>();
        testInterval = TimeSpan.FromSeconds(RandomGenerator.GetInt32());

        job.Setup(j => j.GetInterval(settings)).Returns(testInterval);
        timerFactory.SetupWithAnyArgs(f => f.Create(null, default, default))
            .Callback<Action, TimeSpan, TimeSpan>((a, t1, t2) => timerTick = a)
            .Returns(timer.Object);
    }

    internal interface IFooJob : IScheduledJob { }

    [Theory, Repeat(10)] // Repeat to verify random time generation
    public void ShouldStartJob(int[] dummy)
    {
        var dummy2 = dummy;
        // Act
        target.Initialize();

        timerFactory.Verify(f => f.Create(It.IsNotNull<Action>(), It.Is<TimeSpan>(t => t > TimeSpan.Zero), testInterval));
        var dueTime = (TimeSpan)timerFactory.Invocations.Single().Arguments[1];
        dueTime.Should().BeGreaterThan(settings.PollingStartupDelay).And.BeLessThan(settings.PollingStartupDelay + testInterval);
        target.NextPollTime.Should().Be(clock.UtcNow + dueTime);
        timer.Verify(t => t.Dispose(), Times.Never);
        job.Verify(j => j.Execute(), Times.Never); // Not yet
        Verify(log.Logged.Single(), LogLevel.Information, "Started", null, ("interval", testInterval));
    }

    [Theory]
    [InlineData(null)]
    [InlineData(-66)]
    [InlineData(0)]
    public void ShouldNotStartJob_IfIntervalIsNotPositive(int? interval)
    {
        job.Setup(j => j.GetInterval(settings)).Returns(interval != null ? (TimeSpan?)TimeSpan.FromSeconds(interval.Value) : null);

        // Act
        target.Initialize();

        timerFactory.VerifyWithAnyArgs(f => f.Create(null, default, default), Times.Never);
        Verify(log.Logged.Single(), LogLevel.Information, "Not starting", null);
    }

    [Fact]
    public void ShouldNotStartMultipleTimes()
    {
        target.Initialize();

        // Act
        var act = () => target.Initialize();

        act.Should().Throw<VanillaBugException>();
    }

    [Fact]
    public void ShouldExecuteJobOnTimerTick()
    {
        target.Initialize();
        clock.UtcNow += TimeSpan.FromHours(2);

        // Act
        timerTick(); // Should not lock future execution
        timerTick();

        job.Verify(j => j.Execute(), Times.Exactly(2));
        target.NextPollTime.Should().Be(clock.UtcNow + testInterval);
    }

    [Fact]
    public void ShouldHandleJobExecutionErrors()
    {
        var jobEx = new Exception("Job error");
        job.Setup(j => j.Execute()).Throws(jobEx);
        target.Initialize();

        // Act
        timerTick(); // Should not lock future execution
        timerTick();

        log.Logged.Should().HaveCount(3);
        Verify(log.Logged[1], LogLevel.Error, "Failed", jobEx);
        Verify(log.Logged[2], LogLevel.Error, "Failed", jobEx);
    }

    [Fact]
    public void ShouldAllowSingleExecutionAtTime()
    {
        var semaphore = new SemaphoreSlim(initialCount: 0);
        job.Setup(j => j.Execute()).Callback(semaphore.Wait);
        target.Initialize();

        // Act
        var task1 = Task.Run(timerTick, TestContext.Current.CancellationToken);
        var task2 = Task.Run(timerTick, TestContext.Current.CancellationToken);

        // First task should block, second should finish quickly with error logged b/c first one us running
#pragma warning disable xUnit1031
        Task.WaitAny([task1, task2], cancellationToken: TestContext.Current.CancellationToken);
#pragma warning restore xUnit1031
        Verify(log.Logged[1], LogLevel.Error, "Cancelling", null, ("interval", testInterval));

        semaphore.Release();
#pragma warning disable xUnit1031
        Task.WaitAll(task1, task2);
#pragma warning restore xUnit1031
        job.Verify(j => j.Execute(), Times.Once);
    }

    [Fact]
    public void ShouldDisposeTimer()
    {
        target.Initialize();

        // Act
        target.Dispose();

        timer.Verify(t => t.Dispose());
        job.Verify(j => j.Execute(), Times.Never());
    }

    private void Verify(LoggedEvent ev, LogLevel level, string substr, Exception ex, params (string, object)[] data)
    {
        ev.Verify(level, ex, EnumerableExtensions.Append(data, ("job", nameof(IFooJob))).ToArray());
        ev.MessageFormat.Should().Contain(substr);
    }
}
