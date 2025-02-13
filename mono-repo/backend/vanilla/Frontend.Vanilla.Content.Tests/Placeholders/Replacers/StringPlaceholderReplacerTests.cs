using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.Placeholders;
using Frontend.Vanilla.Content.Placeholders.Replacers;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Placeholders.Replacers;

public sealed class StringPlaceholderReplacerTests
{
    private static readonly IFieldPlaceholderReplacer<string> Target = new StringPlaceholderReplacer();

    [Fact]
    public void ShouldGetReplaceableStrings()
    {
        var result = Target.GetReplaceableStrings("str"); // Act
        result.Should().BeEquivalentTo("str");
    }

    [Fact]
    public void ShouldReplaceAllPlaceholders()
    {
        var replacedStrs = new ReplacedStringMapping(new Dictionary<string, string> { ["str"] = "replaced" });

        // Act
        var result = Target.Recreate("str", replacedStrs);

        result.Should().Be("replaced");
    }
}
