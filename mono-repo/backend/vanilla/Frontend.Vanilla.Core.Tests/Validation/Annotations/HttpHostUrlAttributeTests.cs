using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Validation.Annotations;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Validation.Annotations;

public sealed class HttpHostUrlAttributeTests
{
    [Theory]
    [InlineData("http://bwin.com/", true)]
    [InlineData("https://bwin.com/path", true)]
    [InlineData("/path", false)]
    [InlineData("unrooted-path", false)]
    [InlineData("ftp://bwin.com/", false)]
    [InlineData("http://bwin.com/path?q=1", false)]
    [InlineData("http://bwin.com/path#section", false)]
    public void ShouldValidate(string input, bool expectedIsValid)
    {
        var target = new HttpHostUrlAttribute();
        var url = new Uri(input, UriKind.RelativeOrAbsolute);

        var result = target.GetInvalidReason(url); // Act

        result.Should().Be(expectedIsValid ? null : HttpHostUrlAttribute.InvalidReason);
        HttpHostUrlAttribute.InvalidReason.Should().NotBeNullOrWhiteSpace();
    }
}
