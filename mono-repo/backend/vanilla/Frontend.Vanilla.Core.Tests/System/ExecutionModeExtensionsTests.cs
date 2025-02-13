using System.Data.Common;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public class ExecutionModeExtensionsTests
{
    private Mock<DbConnection> connection;
    private Mock<DbCommand> command;
    private CancellationToken ct;

    public ExecutionModeExtensionsTests()
    {
        connection = new Mock<DbConnection>();
        command = new Mock<DbCommand>();
        ct = TestCancellationToken.Get();
    }

    [Fact]
    public void OpenAsync_ShouldExecuteSynchronously()
    {
        var task = connection.Object.OpenAsync(ExecutionMode.Sync); // Act

        connection.Verify(c => c.Open());
        task.Should().BeSameAs(Task.CompletedTask);
    }

    [Fact]
    public void OpenAsync_ShouldExecuteAsynchronously()
    {
        var openAsyncTask = Task.FromResult("dummy");
        connection.Setup(c => c.OpenAsync(ct)).Returns(openAsyncTask);

        var task = connection.Object.OpenAsync(ExecutionMode.Async(ct)); // Act

        task.Should().BeSameAs(openAsyncTask);
    }

    [Fact]
    public async Task ExecuteScalarAsync_ShouldExecuteSynchronously()
    {
        command.Setup(c => c.ExecuteScalar()).Returns("result");

        var task = command.Object.ExecuteScalarAsync(ExecutionMode.Sync); // Act

        task.Status.Should().Be(TaskStatus.RanToCompletion);
        (await task).Should().Be("result");
    }

    [Fact]
    public void ExecuteScalarAsync_ShouldExecuteAsynchronously()
    {
        var executeAsyncTask = Task.FromResult(new object());
        command.Setup(c => c.ExecuteScalarAsync(ct)).Returns(executeAsyncTask);

        var task = command.Object.ExecuteScalarAsync(ExecutionMode.Async(ct)); // Act

        task.Should().BeSameAs(executeAsyncTask);
    }

    [Fact]
    public async Task ExecuteNonQueryAsync_ShouldExecuteSynchronously()
    {
        command.Setup(c => c.ExecuteNonQuery()).Returns(123);

        var task = command.Object.ExecuteNonQueryAsync(ExecutionMode.Sync); // Act

        task.Status.Should().Be(TaskStatus.RanToCompletion);
        (await task).Should().Be(123);
    }

    [Fact]
    public void ExecuteNonQueryAsync_ShouldExecuteAsynchronously()
    {
        var executeAsyncTask = Task.FromResult(123);
        command.Setup(c => c.ExecuteNonQueryAsync(ct)).Returns(executeAsyncTask);

        var task = command.Object.ExecuteNonQueryAsync(ExecutionMode.Async(ct)); // Act

        task.Should().BeSameAs(executeAsyncTask);
    }
}
