using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Validation.Annotations;
using Frontend.Vanilla.Core.Validation.Annotations.Abstract;
using Frontend.Vanilla.Testing;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Validation.Annotations;

public sealed class RootedPathAttributeTests
{
    private static readonly ValidationAttributeBase Target = new RootedPathAttribute();

    [Theory]
    [InlineData(@"\\file-share\dir\file.json")]
    [InlineData(@"dir\file.txt")]
    public void PositiveTest(string input)
        => Target.GetInvalidReason((string)OperatingSystemRootedPath.Get(input)).Should().BeNull();

    [Fact]
    public void InvalidCharsTest()
    {
        var reason = Target.GetInvalidReason(@"dir\invalid|.json<");

        if (OperatingSystem.IsWindows())
        {
            reason.Should().Contain(@"must be a valid rooted (absolute) file system path but it contains invalid characters: '|'");
        }
        else
        {
            reason.Should().Contain("must be a valid rooted (absolute) file system path but it isn't rooted");
        }
    }

    [Theory]
    [InlineData("file.json")]
    [InlineData(@"dir\file.json")]
    public void RelativePathTest(string input)
        => Target.GetInvalidReason(input).Should().Be("must be a valid rooted (absolute) file system path but it isn't rooted");
}
