using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.Tests.System.Text;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.IO;

public class RootedPathTests
{
    public static IEnumerable<string> ValidPaths => new[]
    {
        OperatingSystemRootedPath.Get("hidden/video.xxx"),
        (string)OperatingSystemRootedPath.Get("navigate-up/../file.txt"),
    };

    [Theory]
    [MemberValuesData(nameof(ValidPaths))]
    public void Constructor_ShouldCreateCorrectly(string value)
    {
        var target = new RootedPath(value);
        target.Value.Should().Be(value);
    }

    public static readonly IEnumerable<object[]> InvalidRootedPathTestCases
        = EnumerableExtensions.Append(RelativePathTests.ValidPaths, "~/web-relative")
            .Select(p => new object[] { p, $"it isn't rooted.{Environment.NewLine}Actual value: '{p}'" })
            .Concat(TrimmedRequiredStringTests.InvalidTestCases);

    [Theory, MemberData(nameof(InvalidRootedPathTestCases))]
    public void Constructor_ShouldFailToCreate(string value, string expectedMsgSuffix)
        => new Func<object>(() => new RootedPath(value))
            .Should().Throw<ArgumentException>().And.Message.Contains("The value must be a valid rooted (absolute) file system path but " + expectedMsgSuffix);

    [Fact]
    public void Combine_ShouldBuildNewPath()
    {
        var target = new RootedPath((string)OperatingSystemRootedPath.Get("Hidden"));
        var result = target.Combine("DoNot", "Open", null, "", "Xxx.mp4");

        if (OperatingSystem.IsWindows())
        {
            result.Value.Should().Be(OperatingSystemRootedPath.Get(@"Hidden\DoNot\Open\Xxx.mp4"));
        }
        else
        {
            result.Value.Should().Be(OperatingSystemRootedPath.Get("Hidden/DoNot/Open/Xxx.mp4"));
        }
    }
}

public class RelativePathTests
{
    public static IEnumerable<string> ValidPaths => new[] { "hidden/video.xxx", "memes.lol", "extensionless", "./relative.txt" };

    [Theory]
    [MemberValuesData(nameof(ValidPaths))]
    public void Constructor_ShouldCreateCorrectly(string value)
    {
        var target = new RelativePath(value);
        target.Value.Should().Be(value);
    }

    [Fact]
    public void Combine_ShouldBuildNewPath()
    {
        var target = new RelativePath(GetPlatformSpecificRoot("This/Is"));

        // Act
        var result = target.Combine(GetPlatformSpecificRoot("Best/Test"), null, "", "Value.txt");

        var expected = GetPlatformSpecificRoot("This/Is/Best/Test/Value.txt");
        result.Value.Should().Be(expected);
    }

    private static string GetPlatformSpecificRoot(string path)
    {
        return path.Replace('/', Path.DirectorySeparatorChar).Replace('\\', Path.DirectorySeparatorChar);
    }
}
