using System;
using System.IO;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.IO.FileSystem;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.IO.FileSystem;

public class ReadFileBytesCommandTests : PhysicalFileTestsBase
{
    private readonly IReadFileBytesCommand target = new ReadFileBytesCommand();

    [RetryFact]
    public async Task ShouldReturnTextContent()
    {
        var testBytes = Guid.NewGuid().ToByteArray();
        TestFile = TempFile.Get(bytes: testBytes);
        File.SetAttributes(TestFile, File.GetAttributes(TestFile) | FileAttributes.ReadOnly); // Should open only for reading

        // Act
        var bytes = await target.ReadAsync(Mode, TestFile);

        bytes.Should().Equal(testBytes);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task ShouldThrowParticularException_IfFileNotExist(bool createDir)
    {
        TestFile = TempFile.Get(createFile: false, createParentDir: createDir);

        Func<Task> act = () => target.ReadAsync(Mode, TestFile);

        (await act.Should().ThrowAsync<FileNotFoundException>()).Which.Message.Should().Contain($"'{TestFile}'");
    }

    [RetryFact(Skip = "Fails on CI")]
    public void ShouldWrapToIOException_IfNotAlready()
    {
        TestFile = new RootedPath(Path.GetDirectoryName(TempFile.Get(createFile: false))); // Directory -> UnauthorizedAccessException

        Func<Task> act = () => target.ReadAsync(Mode, TestFile);

        act.Should().ThrowAsync<IOException>()
            .Result.WithMessage($"Failed reading file '{TestFile}'.")
            .Which.InnerException.Should().BeOfType<UnauthorizedAccessException>();
    }
}
