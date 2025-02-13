using System;
using System.IO;
using FluentAssertions;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.IO.FileSystem;
using Frontend.Vanilla.Testing;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.IO.FileSystem;

public class WatchFileCommandTests : PhysicalFileTestsBase
{
    private readonly IWatchFileCommand target = new WatchFileCommand();

    [Theory]
    [InlineData(true, true)]
    [InlineData(false, true)]
    [InlineData(false, false)]
    public void ShouldWatch_IfNotExists(bool fileAlreadyExists, bool parentDirAlreadyExists)
    {
        if (OperatingSystem.IsWindows())
        {
            string receivedCallback = null;
            var callback = new Action<object>(s => receivedCallback = s?.ToString());
            TestFile = TempFile.Get(createFile: fileAlreadyExists, createParentDir: parentDirAlreadyExists);

            var token = target.Watch(TestFile); // Act

            token.RegisterChangeCallback(callback, "state");
            token.HasChanged.Should().BeFalse();

            Directory.CreateDirectory(Path.GetDirectoryName(TestFile));
            File.WriteAllText(TestFile, "test");

            Wait.Until(() => token.HasChanged);
            Wait.Until(() => receivedCallback == "state");
        }
    }

    [Fact]
    public void ShouldWrapToIOException_IfNotAlready()
    {
        var invalidDrivePath = "A:/invalid-drive.txt";

        if (!OperatingSystem.IsWindows())
        {
            invalidDrivePath = "/mnt/A/invalid-drive.txt";
        }

        TestFile = new RootedPath(invalidDrivePath);

        Action act = () => target.Watch(TestFile);

        // Skipped because it does not generate any Exception on linux from Watch method
        if (OperatingSystem.IsWindows())
        {
            act.Should().Throw<IOException>()
                .WithMessage($"Failed watching file '{TestFile}'.")
                .Which.InnerException.Should().BeOfType<DirectoryNotFoundException>();
        }
    }
}
