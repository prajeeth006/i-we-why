using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading;

public class SyncPreCachingContentProcessorTests
{
    [Fact]
    public async Task ShouldCallSync()
    {
        var underlyingMock = new Mock<SyncPreCachingContentProcessor>();
        IPreCachingContentProcessor target = underlyingMock.Object;

        var mode = TestExecutionMode.Get();
        var content = TestContent.GetSuccess();
        var justInTimeProcessors = Mock.Of<ICollection<IJustInTimeContentProcessor>>();
        var trace = Mock.Of<Action<object>>();
        var innerResult = TestContent.GetSuccess();

        underlyingMock.Setup(m => m.Process(content, justInTimeProcessors, trace)).Returns(innerResult);

        // Act
        var result = await target.ProcessAsync(mode, content, justInTimeProcessors, trace);

        result.Should().BeSameAs(innerResult);
    }
}
