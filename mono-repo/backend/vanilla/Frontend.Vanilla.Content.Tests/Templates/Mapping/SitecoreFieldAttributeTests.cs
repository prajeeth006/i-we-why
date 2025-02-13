using FluentAssertions;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Templates.Mapping;

public class SitecoreFieldAttributeTests
{
    [Theory, BooleanData]
    public void ShouldCreateCorrectly(bool shared)
    {
        var target = new SitecoreFieldAttribute("Title", "Text", shared); // Act

        target.Name.Should().Be("Title");
        target.Type.Should().Be("Text");
        target.Shared.Should().Be(shared);
    }
}
