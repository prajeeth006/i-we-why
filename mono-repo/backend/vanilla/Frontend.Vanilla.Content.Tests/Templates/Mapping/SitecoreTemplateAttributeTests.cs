using System;
using FluentAssertions;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Core.System.Text;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Templates.Mapping;

public class SitecoreTemplateAttributeTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        var target = new SitecoreTemplateAttribute("TestTmpl", typeof(TestProfile)); // Act

        target.Name.Should().Be("TestTmpl");
        target.MappingProfile.Should().Be(typeof(TestProfile));
    }

    [Fact]
    public void ShouldThrow_IfInvalidProfileType()
        => new Func<object>(() => new SitecoreTemplateAttribute("TestTmpl", typeof(string)))
            .Should().Throw<ArgumentException>()
            .Which.ParamName.Should().Be(nameof(SitecoreTemplateAttribute.MappingProfile).ToCamelCase());

    public class TestProfile : TemplateMappingProfile
    {
        protected override void OnMap() { }
    }
}
