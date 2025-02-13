using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Placeholders;
using Frontend.Vanilla.Content.Placeholders.Replacers;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Placeholders.Replacers;

public sealed class ContentLinkPlaceholdersReplacerTests
{
    private IFieldPlaceholderReplacer<ContentLink> target;
    private Mock<IFieldPlaceholderReplacer<ContentParameters>> attributesReplacer;
    private Mock<IFieldPlaceholderReplacer<Uri>> urisReplacer;
    private ContentLink link;

    public ContentLinkPlaceholdersReplacerTests()
    {
        attributesReplacer = new Mock<IFieldPlaceholderReplacer<ContentParameters>>();
        urisReplacer = new Mock<IFieldPlaceholderReplacer<Uri>>();
        target = new ContentLinkPlaceholderReplacer(attributesReplacer.Object, urisReplacer.Object);
        link = new ContentLink(new Uri("http://url"), "text", ContentParameters.Empty);
    }

    [Fact]
    public void ShouldGetReplaceableStrings()
    {
        attributesReplacer.Setup(r => r.GetReplaceableStrings(link.Attributes)).Returns(new[] { "attr-1", "attr-2" });
        urisReplacer.Setup(r => r.GetReplaceableStrings(link.Url)).Returns(new[] { "uri-1", "uri-2" });

        // Act
        var result = target.GetReplaceableStrings(link);

        result.Should().BeEquivalentTo("text", "attr-1", "attr-2", "uri-1", "uri-2");
    }

    [Fact]
    public void ShouldReplaceAllPlaceholders()
    {
        var newAttrs = new Dictionary<string, string> { { Guid.NewGuid().ToString(), null } }.AsContentParameters();
        var replacedStrs = new ReplacedStringMapping(new Dictionary<string, string> { ["text"] = "replaced" });
        attributesReplacer.Setup(r => r.Recreate(link.Attributes, replacedStrs)).Returns(newAttrs);
        urisReplacer.Setup(r => r.Recreate(link.Url, replacedStrs)).Returns(new Uri("http://replaced"));

        // Act
        var result = target.Recreate(link, replacedStrs);

        result.Url.Should().Be(new Uri("http://replaced"));
        result.Text.Should().Be("replaced");
        result.Attributes.Should().Equal(newAttrs);
    }
}
