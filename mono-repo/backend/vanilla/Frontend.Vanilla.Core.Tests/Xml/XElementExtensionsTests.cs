using System;
using System.Xml.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Xml;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Xml;

public class XElementExtensionsTests
{
    [Fact]
    public void ToBytes_Test()
    {
        const string xmlStr = "<xml><test attr=\"value\" /></xml>";
        var xml = XElement.Parse(xmlStr);

        var bytes = xml.ToBytes(); // Act

        bytes.DecodeToString().Should().Be(xmlStr);
    }

    [Theory]
    [InlineData("ok")]
    [InlineData("  not-trimmed  ")]
    public void RequiredAttributeValue_ShouldReturnValue(string value)
    {
        var xml = XElement.Parse($"<xml test=\"{value}\" />");

        var result = xml.RequiredAttributeValue("test"); // Act

        result.Should().Be(value); // Act
    }

    [Fact]
    public void RequiredAttributeValue_ShouldThrow_IfNoAttribute()
    {
        var xml = XElement.Parse("<root test2='val' wtf='omg' />");

        Action act = () => xml.RequiredAttributeValue("test"); // Act

        act.Should().Throw<RequiredXmlAttributeException>().WithMessage(
            "Missing required attribute 'test' on element <root>. Existing attributes: 'test2', 'wtf'.");
    }

    [Theory]
    [InlineData("<root test='' />")]
    [InlineData("<root test='  ' />")]
    public void RequiredAttributeValue_ShouldThrow_IfNoAttributeOrValue(string xmlStr)
    {
        var xml = XElement.Parse(xmlStr);

        Action act = () => xml.RequiredAttributeValue("test"); // Act

        act.Should().Throw<RequiredXmlAttributeException>().WithMessage(
            "Value of attribute 'test' on element <root> is required but it's null or white-space.");
    }
}
