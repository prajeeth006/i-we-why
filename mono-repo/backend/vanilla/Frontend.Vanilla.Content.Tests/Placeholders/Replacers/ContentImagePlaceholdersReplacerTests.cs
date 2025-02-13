using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Placeholders;
using Frontend.Vanilla.Content.Placeholders.Replacers;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Placeholders.Replacers;

public sealed class ContentImagePlaceholdersReplacerTests
{
    private static readonly IFieldPlaceholderReplacer<ContentImage> Target = new ContentImagePlaceholderReplacer();

    [Fact]
    public void ShouldGetReplaceableStrings()
    {
        var image = new ContentImage("http://image", "Desc", 16, 9);

        // Act
        var result = Target.GetReplaceableStrings(image);

        result.Should().BeEquivalentTo("http://image", "Desc");
    }

    [Fact]
    public void ShouldRecreateWithReplacedStrings()
    {
        var image = new ContentImage("http://image", "Desc", 16, 9);
        var replacedStrings = new ReplacedStringMapping(new Dictionary<string, string> { ["http://image"] = "http://replaced", ["Desc"] = "Replace Desc" });

        // Act
        var result = Target.Recreate(image, replacedStrings);

        result.Should().BeEquivalentTo(new ContentImage("http://replaced", "Replace Desc", 16, 9));
    }
}
