using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.Ioc;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Xunit;

[module: SuppressMessage("StyleCop.CSharp.MaintainabilityRules", "SA1403:FileMayOnlyContainASingleNamespace", Justification = "Test namespace for a test.")]

namespace Frontend.Vanilla.Features.Tests.Ioc;

public class BootTaskExecutorTests
{
    private TestLogger<BootTaskExecutor> log;

    public BootTaskExecutorTests()
        => log = new TestLogger<BootTaskExecutor>();

    [Fact]
    public async Task ShouldExecuteAllTasks()
    {
        var executed = new List<string>();
        var tasks = new TestTask[]
        {
            new NonVanillaTask
            {
                Func = () =>
                {
                    executed.Add("NonVanilla");
                    return Task.CompletedTask;
                },
            },
            new Task1
            {
                Func = () =>
                {
                    executed.Add("Task1");
                    return Task.CompletedTask;
                },
            },
            new Task2
            {
                Func = () =>
                {
                    executed.Add("Task2");
                    return Task.CompletedTask;
                },
            },
        };
        var target = new BootTaskExecutor(tasks, log);

        // Act
        await target.ExecuteTasksAsync();

        executed.Should().Equal("NonVanilla", "Task1", "Task2");

        log.Logged.Should().HaveCount(5);
        log.Logged[0].Verify(LogLevel.Information);
        log.Logged[1].Verify(LogLevel.Information, ("type", typeof(NonVanillaTask).ToString()));
        log.Logged[2].Verify(LogLevel.Information, ("type", typeof(Task1).ToString()));
        log.Logged[3].Verify(LogLevel.Information, ("type", typeof(Task2).ToString()));
        log.Logged[4].Verify(LogLevel.Information);
    }

    [Fact]
    public async Task ShouldThrow_IfExecutedMultipleTimes()
    {
        var target = new BootTaskExecutor(Array.Empty<IBootTask>(), log);
        await target.ExecuteTasksAsync();

        var act = target.ExecuteTasksAsync; // Act

        await act.Should().ThrowAsync<InvalidOperationException>();
    }

    internal abstract class TestTask : IBootTask
    {
        internal Func<Task> Func { get; set; }
        public Task ExecuteAsync() => Func.Invoke();
    }

    private sealed class Task1 : TestTask { }

    private sealed class Task2 : TestTask { }
}

internal sealed class NonVanillaTask : BootTaskExecutorTests.TestTask { }
