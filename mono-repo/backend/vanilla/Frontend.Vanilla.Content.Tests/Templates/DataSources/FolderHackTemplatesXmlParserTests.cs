using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.Templates;
using Frontend.Vanilla.Content.Templates.DataSources;
using Frontend.Vanilla.Content.Tests.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Templates.DataSources;

public class FolderHackTemplatesXmlParserTests
{
    private ISitecoreServiceTemplatesXmlParser target;
    private Mock<ISitecoreServiceTemplatesXmlParser> inner;

    private XElement xml;
    private Action<string> trace;
    private List<SitecoreTemplate> innerTemplates;

    public FolderHackTemplatesXmlParserTests()
    {
        inner = new Mock<ISitecoreServiceTemplatesXmlParser>();
        target = new FolderHackTemplatesXmlParser(inner.Object);

        xml = XElement.Parse("<templates />");
        trace = Mock.Of<Action<string>>();
        innerTemplates = new List<SitecoreTemplate> { TestSitecoreTemplate.Get() };

        inner.Setup(i => i.Parse(xml, trace)).Returns(innerTemplates);
    }

    [Fact]
    public void ShouldAddFolderTemplate()
    {
        var result = target.Parse(xml, trace); // Act

        result.Should().Contain(innerTemplates)
            .And.HaveCount(innerTemplates.Count + 1);

        var folderTmpl = result.Except(innerTemplates).Single();
        folderTmpl.Name.Should().Be(FolderHackTemplatesXmlParser.TemplateName);
        folderTmpl.Source.Should().Be(FolderHackTemplatesXmlParser.Source);
        folderTmpl.BaseTemplates.Should().BeEmpty();
        folderTmpl.OwnFields.Should().BeEmpty();
    }

    [Theory]
    [InlineData("folder")]
    [InlineData("FOLder")]
    public void ShouldNotAddFolder_IfAlreadyContained(string existingTmplName)
    {
        innerTemplates.Add(TestSitecoreTemplate.Get(existingTmplName));

        var result = target.Parse(xml, trace); // Act

        result.Should().BeEquivalentTo(innerTemplates);
    }
}
