using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Core.Time.Background;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Time.Background;

public class BackgroundWorkerTests
{
    private IBackgroundWorker target;
    private Mock<ITask> taskApi;
    private Mock<IBackgroundWorkInitializer> initializer1;
    private Mock<IBackgroundWorkInitializer> initializer2;
    private Mock<IExecutionContext> executionContext;
    private TestLogger<BackgroundWorker> log;

    private Mock<IBackgroundOperation> operation;
    private Mock<SetupBackgroundContextHandler> initFunc1;
    private Mock<SetupBackgroundContextHandler> initFunc2;
    private Mock<IDisposable> execFlow;
    private Func<Task> receivedAsyncFuncToRun;
    private Task returnedTaskApiTask;
    private Exception testEx;
    private List<string> executed;

    public BackgroundWorkerTests()
    {
        taskApi = new Mock<ITask>();
        initializer1 = new Mock<IBackgroundWorkInitializer>();
        initializer2 = new Mock<IBackgroundWorkInitializer>();
        executionContext = new Mock<IExecutionContext>();
        log = new TestLogger<BackgroundWorker>();
        target = new BackgroundWorker(taskApi.Object, new[] { initializer1.Object, initializer2.Object }, executionContext.Object, log);

        operation = new Mock<IBackgroundOperation>();
        initFunc1 = new Mock<SetupBackgroundContextHandler>();
        initFunc2 = new Mock<SetupBackgroundContextHandler>();
        execFlow = new Mock<IDisposable>();
        receivedAsyncFuncToRun = null;
        returnedTaskApiTask = Task.FromResult(new object());
        testEx = new Exception("Oups");
        executed = new List<string>();

        initializer1.Setup(i => i.CaptureParentContext())
            .Callback(() => executed.Add("Init1_Capture"))
            .Returns(initFunc1.Object);
        initializer2.Setup(i => i.CaptureParentContext())
            .Callback(() => executed.Add("Init2_Capture"))
            .Returns(initFunc2.Object);
        initFunc1.Setup(f => f())
            .Callback(() => executed.Add("Init1_Setup"));
        initFunc2.Setup(f => f())
            .Callback(() => executed.Add("Init2_Setup"));
        executionContext.Setup(c => c.SuppressFlow())
            .Callback(() => executed.Add("Flow_Suppress"))
            .Returns(execFlow.Object);
        execFlow.Setup(f => f.Dispose())
            .Callback(() => executed.Add("Flow_Restore"));
        taskApi.SetupWithAnyArgs(t => t.Run(null))
            .Callback<Func<Task>>(f =>
            {
                receivedAsyncFuncToRun = f;
                executed.Add("Task_Run");
            })
            .Returns(returnedTaskApiTask);
        operation.Setup(o => o.ExecuteAsync())
            .Callback(() => executed.Add("Operation"))
            .Returns(Task.CompletedTask);
    }

    [Fact]
    public void RunningOperationCount_ShouldBeZeroByDefault()
        => target.RunningOperationCount.Should().Be(0);

    [Fact]
    public async Task ShouldRunTaskOnBackgroundThread_InitializingItCorrectly()
    {
        // Act 1
        var task = target.Run(operation.Object);

        task.Should().BeSameAs(returnedTaskApiTask);
        initializer1.Verify(i => i.CaptureParentContext());
        initializer2.Verify(i => i.CaptureParentContext());
        executed.Should().Equal("Init1_Capture", "Init2_Capture", "Flow_Suppress", "Task_Run", "Flow_Restore");
        executed.Clear();
        target.RunningOperationCount.Should().Be(1);

        // Act 2
        await receivedAsyncFuncToRun();

        executed.Should().Equal("Init1_Setup", "Init2_Setup", "Operation");
        log.VerifyNothingLogged();
        target.RunningOperationCount.Should().Be(0);
    }

    [Fact]
    public void ShouldRestoreFlow_IfFailedToRunOperation()
    {
        taskApi.SetupWithAnyArgs(t => t.Run(null)).Throws(testEx);

        Action act = () => target.Run(operation.Object);

        act.Should().Throw().SameAs(testEx);
        executed.Last().Should().Be("Flow_Restore");
    }

    [Fact]
    public async Task ShouldHandleExceptions_FromInitializer()
    {
        initFunc1.Setup(f => f()).Throws(testEx);
        await RunFailedRunTest();
    }

    [Fact]
    public async Task ShouldHandleExceptions_FromOperation()
    {
        operation.Setup(o => o.ExecuteAsync()).ThrowsAsync(testEx);
        await RunFailedRunTest();
    }

    private async Task RunFailedRunTest()
    {
        operation.SetupGet(o => o.DebugInfo).Returns("OperationInfo");
        target.Run(operation.Object).Should().BeSameAs(returnedTaskApiTask);

        // Act
        await receivedAsyncFuncToRun();

        log.Logged.Single().Verify(LogLevel.Error, testEx, ("info", "OperationInfo"));
    }
}
