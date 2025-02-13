using FluentAssertions;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.Content.Tests;

public class DocumentMetadataTests
{
    [Fact]
    public void ConstructorTest()
    {
        var id = new DocumentId("Test/1");
        var templateName = "MyTest";
        var version = 123;
        var childIds = new DocumentId[] { };
        var sitecoreLoadTime = TestTime.GetRandomUtc();
        var hasFilter = true;

        // Act
        var target = new DocumentMetadata(id, templateName, version, childIds, sitecoreLoadTime, hasFilter);

        target.Id.Should().BeSameAs(id);
        target.TemplateName.Should().Be(templateName);
        target.Version.Should().Be(version);
        target.ChildIds.Should().Equal(childIds);
        target.SitecoreLoadTime.Should().Be(sitecoreLoadTime);
        target.HasFilterCondition.Should().Be(hasFilter);
    }
}
