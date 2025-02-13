using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading;

public class SyncJustInTimeContentProcessorTests
{
    [Fact]
    public async Task ShouldCallSync()
    {
        var underlyingMock = new Mock<SyncJustInTimeContentProcessor>();
        IJustInTimeContentProcessor target = underlyingMock.Object;

        var mode = TestExecutionMode.Get();
        var content = TestContent.GetSuccess();
        var options = TestContentLoadOptions.Get();
        var loader = Mock.Of<IContentLoader>();
        var trace = Mock.Of<Action<object>>();
        var innerResult = TestContent.GetSuccess();

        underlyingMock.Setup(m => m.Process(content, options, loader, trace)).Returns(innerResult);

        // Act
        var result = await target.ProcessAsync(mode, content, options, loader, trace);

        result.Should().BeSameAs(innerResult);
    }
}
