using FluentAssertions;
using Frontend.Vanilla.Content.Templates;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Templates;

public class SitecoreTemplateFieldTests
{
    [Theory, BooleanData]
    public void ShouldCreateCorrectly(bool shared)
    {
        var target = new SitecoreTemplateField("Title", "Text Line", shared);

        target.Name.Should().Be("Title");
        target.Type.Should().Be("Text Line");
        target.Shared.Should().Be(shared);
    }
}
