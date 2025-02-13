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

public class GetPropertiesCommandTests : PhysicalFileTestsBase
{
    private readonly IGetPropertiesCommand target = new GetPropertiesCommand();

    [RetryFact]
    public async Task ShouldCollectFileProperties()
    {
        var creationTime = DateTime.UtcNow;
        await WaitForSystemIOAsync();

        TestFile = TempFile.Get(createFile: true);
        await WaitForSystemIOAsync();

        var writeTime = DateTime.UtcNow;
        var newWriteTime = writeTime.AddSeconds(2);
        await WaitForSystemIOAsync();

        await File.WriteAllBytesAsync(TestFile, Guid.NewGuid().ToByteArray());
        await WaitForSystemIOAsync();

        // Act
        var props = (FileProperties)target.Get(TestFile);

        props.Size.Should().Be(16);
        props.CreationTime.Value.Should().BeAfter(creationTime).And.BeBefore(newWriteTime);
        props.LastWriteTime.Value.Should().BeAfter(writeTime).And.BeBefore(DateTime.UtcNow);
    }

    [RetryFact]
    public async Task ShouldCollectDirectoryProperties()
    {
        var creationTime = DateTime.UtcNow;
        await WaitForSystemIOAsync();

        TestFile = TempFile.Get(createFile: false, createParentDir: true);
        var testDir = new RootedPath(Path.GetDirectoryName(TestFile));
        await WaitForSystemIOAsync();

        var writeTime = DateTime.UtcNow;
        var newWriteTime = writeTime.AddSeconds(2);
        await WaitForSystemIOAsync();

        await File.WriteAllBytesAsync(TestFile, Guid.NewGuid().ToByteArray());
        await WaitForSystemIOAsync();

        // Act
        var props = (DirectoryProperties)target.Get(testDir);

        props.CreationTime.Value.Should().BeAfter(creationTime).And.BeBefore(newWriteTime);
        props.LastWriteTime.Value.Should().BeAfter(writeTime).And.BeBefore(DateTime.UtcNow);
    }

    private Task WaitForSystemIOAsync() => Task.Delay(100);

    [Fact]
    public void ShouldReturnNull_IfNotExist()
    {
        TestFile = TempFile.Get(createFile: false, createParentDir: false);

        // Act
        var props = target.Get(TestFile);

        props.Should().BeNull();
    }
}
