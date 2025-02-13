using FluentAssertions;
using Frontend.Vanilla.Content.Templates;
using Xunit;

namespace Frontend.Vanilla.Content.Tests;

public class TemplateFieldTests
{
    [Fact]
    public void ConstructorTest()
    {
        var templateField = new SitecoreTemplateField("Name", "string", true);

        templateField.Name.Should().Be("Name");
        templateField.Type.Should().Be("string");
        templateField.Shared.Should().BeTrue();
    }
}
