using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Time.Background;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Time.Background;

public class BackgroundOperationTests
{
    [Fact]
    public void ExecuteAsync_ShouldCallFunction()
    {
        var function = new Mock<Func<string, Task>>();
        var target = new BackgroundOperation<string>(function.Object, "testArg");

        var funcTask = Task.FromResult(new object());
        function.Setup(f => f("testArg")).Returns(funcTask);

        var task = target.ExecuteAsync(); // Act

        task.Should().BeSameAs(funcTask);
    }

    [Fact]
    public void DebugInfo_ShouldReturnMethodInfo()
    {
        var target = new BackgroundOperation<string>(TestOperation, "testArg");

        var info = target.DebugInfo; // Act

        info.Should().Be($"{typeof(Task)} {nameof(TestOperation)}({typeof(string)}) from {typeof(BackgroundOperationTests)} with argument 'testArg'");
    }

    private Task TestOperation(string arg) => Task.CompletedTask;
}
