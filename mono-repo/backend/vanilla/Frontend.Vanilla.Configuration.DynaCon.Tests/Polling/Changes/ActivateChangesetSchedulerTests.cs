using System;
using System.Linq;
using Frontend.Vanilla.Configuration.DynaCon.Polling.Changes;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Polling.Changes;

public sealed class ActivateChangesetSchedulerTests
{
    private IActivateChangesetScheduler target;
    private Mock<Func<IValidChangeset, IActivateChangesetJob>> jobFactory;
    private Mock<ITimerFactory> timerFactory;
    private TestClock clock;
    private TestLogger<ActivateChangesetScheduler> log;

    private IValidChangeset changeset;
    private Mock<IDisposable> timer;
    private Mock<IActivateChangesetJob> job;
    private Action timerTick;

    public ActivateChangesetSchedulerTests()
    {
        jobFactory = new Mock<Func<IValidChangeset, IActivateChangesetJob>>();
        timerFactory = new Mock<ITimerFactory>();
        clock = new TestClock();
        log = new TestLogger<ActivateChangesetScheduler>();
        target = new ActivateChangesetScheduler(jobFactory.Object, timerFactory.Object, clock, log);

        changeset = Mock.Of<IValidChangeset>(c => c.ValidFrom == clock.UtcNow.AddMinutes(10));
        job = new Mock<IActivateChangesetJob>();
        timer = new Mock<IDisposable>();
        timerTick = null;

        jobFactory.Setup(f => f(changeset)).Returns(job.Object);
        timerFactory.SetupWithAnyArgs(f => f.Create(null, default, default))
            .Callback<Action, TimeSpan, TimeSpan>((a, b, c) => timerTick = a)
            .Returns(timer.Object);
    }

    [Fact]
    public void ShouldCreateAndScheduleJob()
    {
        // Act
        target.ScheduleActivation(changeset);

        jobFactory.Verify(f => f(changeset));
        timerFactory.Verify(f => f.Create(It.IsNotNull<Action>(), TimeSpan.FromMinutes(10).Add(ActivateChangesetScheduler.GracePeriod), TimeSpan.Zero));
        timer.Verify(t => t.Dispose(), Times.Never());
        log.VerifyNothingLogged();
    }

    [Fact]
    public void ShouldCreateAndScheduleJobOnlyOncePerChangeset()
    {
        target.ScheduleActivation(changeset);
        target.ScheduleActivation(changeset); // Act
        jobFactory.Verify(f => f(changeset), Times.Once);
    }

    [Fact]
    public void ShouldExecuteJobOnTimerTick()
    {
        // Act
        target.ScheduleActivation(changeset);
        timerTick();

        job.Verify(j => j.Execute());
        timer.Verify(t => t.Dispose());
        log.VerifyNothingLogged();
    }

    [Fact]
    public void ShouldDisposeAllTimesOnSchedulerDispose()
    {
        target.ScheduleActivation(changeset);

        var timer2 = new Mock<IDisposable>();
        timerFactory.SetupWithAnyArgs(f => f.Create(null, default, default)).Returns(timer2.Object);
        target.ScheduleActivation(Mock.Of<IValidChangeset>(c => c.ValidFrom == clock.UtcNow.AddMinutes(10)));

        // Act
        target.Dispose();

        timer.Verify(t => t.Dispose());
        timer2.Verify(t => t.Dispose());
    }

    [Fact]
    public void ShouldHandleJobError()
    {
        var ex = new Exception("Job error");
        job.Setup(j => j.Execute()).Throws(ex);

        // Act
        target.ScheduleActivation(changeset);
        timerTick();

        log.Logged.Single().Verify(LogLevel.Error, ex);
        timer.Verify(t => t.Dispose());
    }
}
