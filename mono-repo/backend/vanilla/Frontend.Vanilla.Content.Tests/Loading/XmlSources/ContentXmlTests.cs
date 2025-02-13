using System;
using System.Xml.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading.XmlSources;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.XmlSources;

public class ContentXmlTests
{
    [Theory]
    [InlineData("<items><item /><other-elm-is-ok /></items>")]
    public void ShouldCreateCorrectly(string xmlStr)
    {
        var xml = XElement.Parse(xmlStr);
        var relExpiration = TimeSpan.FromSeconds(66);
        var sitecoreLoadTime = TestTime.GetRandomUtc();

        // Act
        var target = new ContentXml(xml, relExpiration, sitecoreLoadTime);

        target.Xml.Should().BeSameAs(xml);
        target.RelativeExpiration.Should().Be(relExpiration);
        target.SitecoreLoadTime.Should().Be(sitecoreLoadTime);
    }

    [Theory]
    [InlineData("<items />")]
    [InlineData("<invalid />")]
    [InlineData("<items><item /><item /></items>")]
    public void ShouldThrow_IfInvalidXml(string xmlStr)
    {
        var xml = xmlStr != null ? XElement.Parse(xmlStr) : null;

        Func<object> act = () => new ContentXml(xml, TimeSpan.FromSeconds(66), TestTime.GetRandomUtc());

        act.Should().Throw<ArgumentException>()
            .WithMessage($"XML must contain root element <{ContentXml.RootElement}> with one child <{ContentXml.ItemElement}>. (Parameter 'xml')");
    }
}
