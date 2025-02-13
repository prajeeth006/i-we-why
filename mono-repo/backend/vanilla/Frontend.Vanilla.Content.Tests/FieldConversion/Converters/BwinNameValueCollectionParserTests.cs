using System;
using System.Linq;
using System.Xml;
using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion.Converters;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.FieldConversion.Converters;

public class BwinNameValueCollectionParserTests
{
    private static readonly IBwinNameValueCollectionParser Target = new BwinNameValueCollectionParser();

    [Fact]
    public void ShouldParseItems()
    {
        const string fieldValue = @"<bwinnamevalue>
                <entry key='k1'>v1.1</entry>
                <entry key='k1'>v1.2</entry>
                <entry key='k2'></entry>
                <entry key='k3' />
                <entry key='k4'>Hello &amp; BWIN</entry>
            </bwinnamevalue>";

        var result = Target.Parse(fieldValue); // Act

        result.Should().Equal(
            ("k1", "v1.1"),
            ("k1", "v1.2"),
            ("k2", ""),
            ("k3", ""),
            ("k4", "Hello & BWIN"));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("  ")]
    [InlineData("<bwinnamevalue />")]
    [InlineData("<bwinnamevalue></bwinnamevalue>")]
    public void ShouldParseEmpty(string fieldValue)
    {
        var result = Target.Parse(fieldValue); // Act
        result.Should().BeEmpty();
    }

    [Theory]
    [InlineData("<bwinnamevalue><entry /></bwinnamevalue>")]
    [InlineData("<bwinnamevalue><entry key='' /></bwinnamevalue>")]
    [InlineData("<bwinnamevalue><entry key='  ' /></bwinnamevalue>")]
    public void ShouldThrow_IfEmptyFieldValue_OrEmptyKey(string fieldValue)
        => new Action(() => Target.Parse(fieldValue).ToList())
            .Should().Throw<FormatException>();

    [Fact]
    public void ShouldThrow_IfMalformedXml()
        => new Action(() => Target.Parse("<shit").ToList()).Should().Throw<XmlException>();
}
