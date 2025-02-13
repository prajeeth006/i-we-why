using System;
using System.IO;
using FluentAssertions;
using Frontend.Vanilla.Core.IO.FileSystem;
using Frontend.Vanilla.Testing;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.IO.FileSystem;

public class DeleteFileCommandTests : PhysicalFileTestsBase
{
    private readonly IDeleteFileCommand target = new DeleteFileCommand();

    [Fact]
    public void ShouldDeleteFile()
    {
        TestFile = TempFile.Get();

        // Act
        target.Delete(TestFile);

        File.Exists(TestFile).Should().BeFalse();
    }

    [Fact]
    public void ShouldWrapExceptions()
    {
        TestFile = OperatingSystemRootedPath.GetRandom();
        Directory.CreateDirectory(TestFile);

        var act = () => target.Delete(TestFile);

        act.Should().Throw<IOException>()
            .Where(e => e.Message.Contains($"'{TestFile}'"))
            .WithInnerException<UnauthorizedAccessException>();
    }
}
