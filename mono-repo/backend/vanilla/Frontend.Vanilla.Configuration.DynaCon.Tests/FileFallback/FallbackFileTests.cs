using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Testing;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.FileFallback;

public sealed class FallbackFileTests
{
    private Mock<IFallbackFileDataHandler<string>> dataHandler;
    private IFileSystem fileSystem;
    private GetAppIdentifierHandler getAppIdentifier;
    private ILogger<FallbackFile<string>> log;

    public FallbackFileTests()
    {
        dataHandler = new Mock<IFallbackFileDataHandler<string>>();
        fileSystem = Mock.Of<IFileSystem>();
        getAppIdentifier = Mock.Of<GetAppIdentifierHandler>();
        log = Mock.Of<ILogger<FallbackFile<string>>>();

        dataHandler.SetupGet(h => h.Path).Returns(OperatingSystemRootedPath.GetRandom());
    }

    private IFallbackFile<string> GetTarget()
        => new FallbackFile<string>(dataHandler.Object, fileSystem, getAppIdentifier, log);

    [Fact]
    public void ShouldCreateHandler()
    {
        // Act
        var target = GetTarget();

        target.Handler.Should().BeOfType<FallbackFileHandler<string>>();
    }

    [Fact]
    public void ShouldNotCreateHandler_IfFileDisabled()
    {
        dataHandler.SetupGet(h => h.Path).Returns(() => null);

        // Act
        var target = GetTarget();

        target.Handler.Should().BeNull();
    }
}
