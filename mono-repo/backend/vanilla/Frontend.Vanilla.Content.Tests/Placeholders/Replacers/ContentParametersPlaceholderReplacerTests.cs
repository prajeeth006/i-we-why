using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Placeholders;
using Frontend.Vanilla.Content.Placeholders.Replacers;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Placeholders.Replacers;

public sealed class ContentParametersPlaceholderReplacerTests
{
    private IFieldPlaceholderReplacer<ContentParameters> target;
    private ContentParameters testCollection;

    public ContentParametersPlaceholderReplacerTests()
    {
        target = new ContentParametersPlaceholderReplacer();
        testCollection = new Dictionary<string, string>
        {
            { "item-1", "value-1" },
            { "item-2", null },
            { "item-3", "value-3" },
        }.AsContentParameters();
    }

    [Fact]
    public void ShouldGetReplaceableStrings()
    {
        var result = target.GetReplaceableStrings(testCollection); // Act

        result.Should().BeEquivalentTo("value-1", null, "value-3");
    }

    [Fact]
    public void ShouldRecreateWithReplacedStrings()
    {
        var replacedStrs = new ReplacedStringMapping(
            new Dictionary<string, string>
            {
                { "value-1", "replaced-1" },
                { "value-3", "replaced-3" },
            });

        var result = target.Recreate(testCollection, replacedStrs); // Act

        result.Should().BeOfType<ContentParameters>();
        result.Should().Equal(
            new Dictionary<string, string>
            {
                { "item-1", "replaced-1" },
                { "item-2", null },
                { "item-3", "replaced-3" },
            });
    }
}
