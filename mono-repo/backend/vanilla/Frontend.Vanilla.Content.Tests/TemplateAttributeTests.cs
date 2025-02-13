using FluentAssertions;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Content.Tests.Mocks;
using Xunit;

namespace Frontend.Vanilla.Content.Tests;

public class TemplateAttributeTests
{
    [Fact]
    public void ConstructorTest()
    {
        var attribute = new SitecoreTemplateAttribute("MockTemplate", typeof(MockMappingProfile));
        attribute.Name.Should().Be("MockTemplate");
        attribute.MappingProfile.FullName.Should().Be(typeof(MockMappingProfile).FullName);
    }
}
