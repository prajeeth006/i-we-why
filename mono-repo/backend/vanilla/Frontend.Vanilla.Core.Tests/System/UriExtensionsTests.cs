using System;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Uris;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public class UriExtensionsTests
{
    [Theory]
    [InlineData(true, "http://bwin.com/page?q=1", "https://BWIN.com?q=1", UriComponents.Query)]
    [InlineData(true, "http://bwin.com/page?q=1", "https://BWIN.com?q=1", UriComponents.Host)]
    [InlineData(false, "http://bwin.com/page?q=1", "https://bwin.com?q=1", UriComponents.Path)]
    [InlineData(false, "http://bwin.com/page?q=1", "https://bwin.com?q=1", UriComponents.PathAndQuery)]
    public void HasEqualComponents_Test(bool expected, string uri1, string uri2, UriComponents partsToCompare)
        => new Uri(uri1).HasEqualComponents(new Uri(uri2), partsToCompare).Should().Be(expected);

    [Theory]
    [InlineData("http://bwin.com", true)]
    [InlineData("https://bwin.com", true)]
    [InlineData("http://bwin.com/some/path", true)]
    [InlineData("http://bwin.com/?q=1", true)]
    [InlineData("http://bwin.com/#section", true)]
    [InlineData("ftp://bwin.com", false)]
    [InlineData("relative", false)]
    public void IsHttp_Test(string url, bool expected)
        => new Uri(url, UriKind.RelativeOrAbsolute).IsHttp().Should().Be(expected);

    [Theory]
    [InlineData("http://bwin.com", true)]
    [InlineData("https://bwin.com", true)]
    [InlineData("http://bwin.com/some/path", true)]
    [InlineData("ftp://bwin.com", false)]
    [InlineData("relative", false)]
    [InlineData("http://bwin.com/?q=1", false)]
    [InlineData("http://bwin.com/#section", false)]
    public void IsHttpHost_Test(string url, bool expected)
        => new Uri(url, UriKind.RelativeOrAbsolute).IsHttpHost().Should().Be(expected);

    [Fact]
    public void ToHttps_ShouldConvertToHttps()
        => new HttpUri("http://bwin.com/test?q=1").ToHttps().Should().Be(new HttpUri("https://bwin.com/test?q=1"));

    [Fact]
    public void ToHttps_ShouldReturnSame_IfAlreadyHttps()
    {
        var url = new HttpUri("https://bwin.com/test?q=1");
        url.ToHttps().Should().BeSameAs(url);
    }
}
