using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Placeholders;
using Frontend.Vanilla.Content.Placeholders.Replacers;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Placeholders.Replacers;

public sealed class SelectListItemPlaceholderReplacerTests
{
    private static readonly IFieldPlaceholderReplacer<IReadOnlyList<ListItem>> Target = new SelectListItemPlaceholderReplacer();

    private static readonly IReadOnlyList<ListItem> TestItems = new[]
    {
        new ListItem("item1", "text1"),
        new ListItem("item2", "text2"),
    }.AsReadOnly();

    [Fact]
    public void ShouldGetReplaceableStrings()
    {
        var result = Target.GetReplaceableStrings(TestItems); // Act
        result.Should().BeEquivalentTo("text1", "text2");
    }

    [Fact]
    public void ShouldRecreateWithReplacedStrings()
    {
        var replacedStrs = new ReplacedStringMapping(
            new Dictionary<string, string>
            {
                ["text1"] = "replaced1",
                ["text2"] = "replaced2",
            });

        // Act
        var result = Target.Recreate(TestItems, replacedStrs);

        result.Should().BeEquivalentTo(new[]
        {
            new ListItem("item1", "replaced1"),
            new ListItem("item2", "replaced2"),
        });
    }
}
