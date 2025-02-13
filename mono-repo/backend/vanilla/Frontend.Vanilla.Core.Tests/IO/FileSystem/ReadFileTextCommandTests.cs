using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.IO.FileSystem;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.IO.FileSystem;

public class ReadFileTextCommandTests
{
    [Fact]
    public async Task ShouldDecodeFileBytes()
    {
        var readFileBytesCommand = new Mock<IReadFileBytesCommand>();
        IReadFileTextCommand target = new ReadFileTextCommand(readFileBytesCommand.Object);
        string pathToFile = OperatingSystemRootedPath.Get("/hidden/xxx/do-not-open.mp4");
        var mode = TestExecutionMode.Get();
        var path = new RootedPath(pathToFile);
        var bytes = new byte[] { 0x48, 0x65, 0x6c, 0x6c, 0x6f };
        readFileBytesCommand.Setup(c => c.ReadAsync(mode, path)).ReturnsAsync(bytes);

        // Act
        var text = await target.ReadAsync(mode, path);

        text.Should().Be("Hello");
    }
}
