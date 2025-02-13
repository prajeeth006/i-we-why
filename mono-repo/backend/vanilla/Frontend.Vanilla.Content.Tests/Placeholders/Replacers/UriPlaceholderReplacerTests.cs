using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.Placeholders;
using Frontend.Vanilla.Content.Placeholders.Replacers;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Placeholders.Replacers;

public sealed class UriPlaceholderReplacerTests
{
    private static readonly IFieldPlaceholderReplacer<Uri> Target = new UriPlaceholderReplacer();
    private static readonly Uri TestUri = new Uri("http://bwin.com");

    [Fact]
    public void ShouldGetReplaceableStrings()
    {
        var result = Target.GetReplaceableStrings(TestUri); // Act
        result.Should().BeEquivalentTo("http://bwin.com");
    }

    [Theory]
    [InlineData("http://replaced.com")]
    [InlineData("replaced-relative")]
    public void ShouldRecreateWithReplacedStrings(string replaced)
    {
        var replacedStrs = new ReplacedStringMapping(new Dictionary<string, string> { ["http://bwin.com"] = replaced });

        // Act
        var result = Target.Recreate(TestUri, replacedStrs);

        result.Should().Be(new Uri(replaced, UriKind.RelativeOrAbsolute));
    }
}
