using System;
using FluentAssertions;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.IO;

public class FileSystemPropertiesTests
{
    private UtcDateTime testTime1;
    private UtcDateTime testTime2;

    public FileSystemPropertiesTests()
    {
        testTime1 = TestTime.GetRandomUtc();
        testTime2 = TestTime.GetRandomUtc();
    }

    [Theory]
    [InlineData(0L)]
    [InlineData(666L)]
    public void FileProperties_ShouldSetPropertiesCorrectly(long size)
    {
        // Act
        var target = new FileProperties(size, testTime1, testTime2);

        target.Size.Should().Be(size);
        target.CreationTime.Should().Be(testTime1);
        target.LastWriteTime.Should().Be(testTime2);
    }

    [Fact]
    public void FileProperties_ShouldThrow_IfNegativeSize()
        => new Func<object>(() => new FileProperties(-1L, testTime1, testTime2))
            .Should().Throw<ArgumentException>().Which.ParamName.Should().Be("size");

    [Fact]
    public void DirectoryProperties_ShouldSetPropertiesCorrectly()
    {
        // Act
        var target = new DirectoryProperties(testTime1, testTime2);

        target.CreationTime.Should().Be(testTime1);
        target.LastWriteTime.Should().Be(testTime2);
    }
}
