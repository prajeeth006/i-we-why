using System;
using System.IO;
using FluentAssertions;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.IO.FileSystem;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.IO.FileSystem;

public class GetFilePropertiesCommandTests
{
    private readonly IGetFilePropertiesCommand target;
    private readonly Mock<IGetPropertiesCommand> getPropertiesCommand;
    private readonly RootedPath testPath;

    public GetFilePropertiesCommandTests()
    {
        getPropertiesCommand = new Mock<IGetPropertiesCommand>();
        target = new GetFilePropertiesCommand(getPropertiesCommand.Object);
        testPath = OperatingSystemRootedPath.GetRandom();
    }

    [Fact]
    public void ShouldReturnProperties_IfFile()
    {
        var testProps = TestFileSystemProperties.GetFile();
        getPropertiesCommand.Setup(c => c.Get(testPath)).Returns(testProps);

        // Act
        var props = target.Get(testPath);

        props.Should().BeSameAs(testProps);
    }

    [Fact]
    public void ShouldReturnNull_IfNotFound()
    {
        // Act
        var props = target.Get(testPath);

        props.Should().BeNull();
        getPropertiesCommand.Verify(c => c.Get(testPath));
    }

    [Fact]
    public void ShouldThrow_IfDirectory()
    {
        getPropertiesCommand.Setup(c => c.Get(testPath)).Returns(TestFileSystemProperties.GetDirectory());

        Action act = () => target.Get(testPath);

        var ex = act.Should().Throw<FileLoadException>().Which;
        ex.Message.Should().ContainAll($"'{testPath}'", "Directory");
        ex.FileName.Should().Be(testPath);
    }
}
