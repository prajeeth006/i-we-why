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

public class WriteFileTextCommandTests : PhysicalFileTestsBase
{
    private readonly IWriteFileTextCommand target = new WriteFileTextCommand();

    [Theory]
    [InlineData(false, true)]
    [InlineData(false, false)]
    [InlineData(true, true)]
    public async Task ShouldWriteFile(bool alreadyExists, bool dirExists)
    {
        TestFile = TempFile.Get(
            createFile: alreadyExists,
            createParentDir: dirExists,
            text: "Much longer test to make sure it's correctly overwritten.");

        // Actapp
        await target.WriteAsync(Mode, TestFile, "Hello BWIN");

        File.ReadAllText(TestFile).Should().Be("Hello BWIN");
    }

    [Fact]
    public async Task ShoulAppendToFile()
    {
        TestFile = TempFile.Get(createFile: false);
        await target.WriteAsync(Mode, TestFile, "first line" + Environment.NewLine);

        // Act
        await target.AppendToFileAsync(Mode, TestFile, "second line" + Environment.NewLine);

        File.ReadAllText(TestFile).Should().Be("first line" + Environment.NewLine + "second line" + Environment.NewLine);
    }

    [Fact]
    public async Task ShouldWriteEmpty_IfNullInput()
    {
        TestFile = TempFile.Get(createFile: false);

        // Act
        await target.WriteAsync(Mode, TestFile, null);

        File.ReadAllText(TestFile).Should().BeEmpty();
    }

    [RetryFact(Skip = "Fails on CI")]
    public void ShouldWrapToIOException_IfNotAlready()
    {
        TestFile = new RootedPath(Path.GetDirectoryName(TempFile.Get(createFile: false))); // Directory -> UnauthorizedAccessException

        var act = () => target.WriteAsync(Mode, TestFile, "whatever");

        act.Should().ThrowAsync<IOException>()
            .Result.WithMessage($"Failed writing file '{TestFile}'.")
            .Which.InnerException.Should().BeOfType<UnauthorizedAccessException>();
    }
}
