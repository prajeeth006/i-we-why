using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public class ExecutionModeTests
{
    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void Sync_ShouldHaveNoToken(bool createAsDefault)
    {
        var target = createAsDefault ? ExecutionMode.Sync : default; // Act
        target.AsyncCancellationToken.Should().BeNull();
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void Async_ShouldHaveGivenToken(bool useDefaultToken)
    {
        var token = !useDefaultToken ? GetUniqueToken() : default;
        var target = ExecutionMode.Async(token); // Act
        target.AsyncCancellationToken.Should().Be(token);
    }

    public static IEnumerable<object[]> GetEqualityTestCases()
    {
        var testToken = GetUniqueToken();

        return new[]
        {
            new object[] { true, ExecutionMode.Sync, ExecutionMode.Sync },
            new object[] { true, ExecutionMode.Async(default), ExecutionMode.Async(default) },
            new object[] { true, ExecutionMode.Async(testToken), ExecutionMode.Async(testToken) },
            new object[] { false, ExecutionMode.Sync, ExecutionMode.Async(default) },
            new object[] { false, ExecutionMode.Sync, ExecutionMode.Async(testToken) },
            new object[] { false, ExecutionMode.Async(default), ExecutionMode.Async(testToken) },
            new object[] { false, ExecutionMode.Async(testToken), ExecutionMode.Async(GetUniqueToken()) },
        };
    }

    [Theory]
    [MemberData(nameof(GetEqualityTestCases))]
    public void ShouldEqualAccordingly(bool expectedEquality, ExecutionMode mode1, ExecutionMode mode2)
        => EqualityTest.Run(expectedEquality, mode1, mode2);

    private static CancellationToken GetUniqueToken() => new CancellationTokenSource().Token;

    public static readonly IEnumerable<object[]> ToStringTestCases = new[]
    {
        new object[] { ExecutionMode.Sync, "sync" },
        new object[] { ExecutionMode.Async(default), "async with default token" },
        new object[] { ExecutionMode.Async(GetUniqueToken()), @"async with token \d+" },
    };

    [Theory]
    [MemberData(nameof(ToStringTestCases))]
    public void ToString_ShouldReportCorrectly(ExecutionMode mode, string expectedRegex)
        => mode.ToString().Should().MatchRegex(expectedRegex);

    public static readonly IEnumerable CompletedVoidTasks = new object[] { Task.CompletedTask, Task.FromResult(123) };

    [Theory, MemberValuesData(nameof(CompletedVoidTasks))]
    public void ExecuteSyncVoid_ShouldPass_IfCompleted(Task task)
        => ExecutionMode.ExecuteSync(task);

    [Fact]
    public void ExecuteSyncWithResult_ShouldReturnResult_IfCompleted()
    {
        var task = Task.FromResult(123);
        var result = ExecutionMode.ExecuteSync(task); // Act
        result.Should().Be(123);
    }

    [Fact]
    public void ExecuteSyncVoid_ShouldThrow_IfFailed()
    {
        var ex = new Exception();
        var task = Task.FromException(ex);

        var act = () => ExecutionMode.ExecuteSync(task);

        act.Should().Throw().SameAs(ex);
    }

    [Fact]
    public void ExecuteSyncWithResult_ShouldThrow_IfFailed()
    {
        var ex = new Exception();
        var task = Task.FromException<int>(ex);

        Action act = () => ExecutionMode.ExecuteSync(task);

        act.Should().Throw().SameAs(ex);
    }

    [Fact]
    public void ExecuteSyncVoid_ShouldThrow_IfNotCompleted()
    {
        var task = (Task)TestTask.GetRunning<string>();
        var act = () => ExecutionMode.ExecuteSync(task);
        ExpectIncompleteError(act);
    }

    [Fact]
    public void ExecuteSyncWithResult_ShouldThrow_IfNotCompleted()
    {
        var task = TestTask.GetRunning<string>();
        Action act = () => ExecutionMode.ExecuteSync(task);
        ExpectIncompleteError(act);
    }

    private static void ExpectIncompleteError(Action act)
        => act.Should().Throw<InvalidAsyncExecutionException>().Which.Message.Should().MatchRegex(
            @"Status of the task must be RanToCompletion or Faulted in case of synchronous execution mode but it is \w+\. So most likely something was executed asynchronously!");
}
