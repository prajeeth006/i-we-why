using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.FileFallback;

public class FallbackFileHandlerBaseTests
{
    private IFallbackFileHandler<string> target;
    private Mock<FallbackFileHandlerBase<string>> underlyingMock;

    public FallbackFileHandlerBaseTests()
    {
        underlyingMock = new Mock<FallbackFileHandlerBase<string>>();
        target = underlyingMock.Object;
    }

    [Fact]
    public void Read_ShouldDelegate()
    {
        underlyingMock.Setup(m => m.ReadAsync(ExecutionMode.Sync)).ReturnsAsync("test");

        // Act
        var result = target.Read();

        result.Should().Be("test");
    }

    [Fact]
    public async Task ReadAsync_ShouldDelegate()
    {
        var ct = TestCancellationToken.Get();
        underlyingMock.Setup(m => m.ReadAsync(ExecutionMode.Async(ct))).ReturnsAsync("test");

        // Act
        var result = await target.ReadAsync(ct);

        result.Should().Be("test");
    }
}
