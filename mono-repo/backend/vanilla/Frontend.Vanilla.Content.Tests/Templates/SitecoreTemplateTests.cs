using System;
using FluentAssertions;
using Frontend.Vanilla.Content.Templates;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Templates;

public class SitecoreTemplateTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        var thisField1 = new SitecoreTemplateField("Foo", "int", false);
        var thisField2 = new SitecoreTemplateField("Bar", "date", false);
        var baseField1 = new SitecoreTemplateField("BaseFoo", "string", false);
        var baseField21 = new SitecoreTemplateField("BaseBar1", "enum", false);
        var baseField22 = new SitecoreTemplateField("BaseBar2", "timespan", false);
        var baseTemplate1 = new SitecoreTemplate("Base1", "Sitecore", Array.Empty<SitecoreTemplate>(), new[] { baseField1 });
        var baseTemplate2 = new SitecoreTemplate("Base2", "Sitecore", Array.Empty<SitecoreTemplate>(), new[] { baseField21, baseField22 });

        // Act
        var target = new SitecoreTemplate("Test", "Secret Source", new[] { baseTemplate1, baseTemplate2 }, new[] { thisField1, thisField2 });

        target.Name.Should().Be("Test");
        target.Source.Should().Be("Secret Source");
        target.BaseTemplates.Should().BeEquivalentTo(baseTemplate1, baseTemplate2);
        target.OwnFields.Should().BeEquivalentTo(thisField1, thisField2);
        target.AllFields.Should().BeEquivalentTo(thisField1, thisField2, baseField1, baseField21, baseField22);
    }

    [Fact]
    public void ShouldFlattenBaseTemplates()
    {
        var thisField = new SitecoreTemplateField("Foo", "int", false);
        var parentField = new SitecoreTemplateField("ParentField", "string", false);
        var grandParentField = new SitecoreTemplateField("GrandField", "string", false);
        var grandParent = new SitecoreTemplate("Grand", "Sitecore", Array.Empty<SitecoreTemplate>(), new[] { grandParentField });
        var parent = new SitecoreTemplate("Parent", "Sitecore", new[] { grandParent }, new[] { parentField });

        // Act
        var target = new SitecoreTemplate("Test", "Sitecore", new[] { parent }, new[] { thisField });

        target.BaseTemplates.Should().BeEquivalentTo(parent, grandParent);
        target.OwnFields.Should().BeEquivalentTo(thisField);
        target.AllFields.Should().BeEquivalentTo(thisField, parentField, grandParentField);
    }

    [Theory, ValuesData(null, "", "  ", "  leading space", "trailing space  ", "slash/inside", "back\\slash")]
    public void ShouldThrow_IfInvalidName(string name)
        => new Func<object>(() => new SitecoreTemplate(name, "Sitecore", Array.Empty<SitecoreTemplate>(), Array.Empty<SitecoreTemplateField>()))
            .Should().Throw<ArgumentException>()
            .Which.ParamName.Should().Be(nameof(SitecoreTemplate.Name).ToCamelCase());
}
