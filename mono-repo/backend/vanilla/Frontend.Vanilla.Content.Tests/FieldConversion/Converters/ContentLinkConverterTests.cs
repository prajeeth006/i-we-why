using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion.Converters;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.FieldConversion.Converters;

public class ContentLinkConverterTests : ConverterTestsBase<ContentLink>
{
    public ContentLinkConverterTests()
        => Target = new ContentLinkConverter();

    [Theory, MemberValuesData(nameof(TestUrls))]
    public void ShouldParseHrefCorrectly(string href)
    {
        Context.SetupGet(x => x.FieldValue).Returns($@"<a href=""{href}"" />");

        ConvertAndExpect(new ContentLink( // Act
            url: new Uri(href, UriKind.RelativeOrAbsolute),
            linkText: null,
            attributes: ContentParameters.Empty));
    }

    [Fact]
    public void ShouldParseAttributesCorrectly()
    {
        Context.SetupGet(x => x.FieldValue).Returns(
            @"<a href=""http://bwin.com"" title=""Awesome link"" class=""ui-button"" target=""_blank"" rel=""help"" data-level=""66"" data-empty="""" ignored=""wtf"">Click Me!</a>");

        ConvertAndExpect(new ContentLink( // aCT
            url: new Uri("http://bwin.com"),
            linkText: "Click Me!",
            attributes: new Dictionary<string, string>
            {
                { "title", "Awesome link" },
                { "class", "ui-button" },
                { "target", "_blank" },
                { "rel", "help" },
                { "data-level", "66" },
                { "data-empty", "" },
            }.AsContentParameters()));
    }

    [Theory, MemberValuesData(nameof(EmptyValues))]
    public void ShouldReturnsNull_IfEmpty(string inputValue)
    {
        Context.SetupGet(x => x.FieldValue).Returns(inputValue);
        ConvertAndExpect(null); // Act
    }

    [Fact]
    public void ShouldThrow_IfNotAnchorTag()
    {
        Context.SetupGet(x => x.FieldValue).Returns("<wtf />");
        Target_Convert.Should().Throw() // Act
            .WithMessage("Link must use <a> tag but it is <wtf>.");
    }

    [Theory]
    [InlineData("<a />", "null")]
    [InlineData("<a href='' />", "''")]
    [InlineData("<a href='  ' />", "'  '")]
    [InlineData("<a href='http://bwin.com:invalid' />", "'http://bwin.com:invalid'")]
    public void ShouldThrow_IfInvalidHref(string html, string reportedHref)
    {
        Context.SetupGet(x => x.FieldValue).Returns(html);
        Target_Convert.Should().Throw() // Act
            .WithMessage($"Invalid absolute or relative URL in href attribute which is {reportedHref}.");
    }
}
