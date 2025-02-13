using FluentAssertions;
using Frontend.Vanilla.Content.Templates.Mapping;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Templates.Mapping;

public class TemplateAssemblySourceTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        var assembly = Mock.Of<TestAssembly>();
        var profile = Mock.Of<TemplateMappingProfile>();

        // Act
        var target = new TemplateAssemblySource(assembly, profile);

        target.Assembly.Should().BeSameAs(assembly);
        target.MappingProfile.Should().BeSameAs(profile);
    }
}
