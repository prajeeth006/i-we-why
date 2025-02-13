using FluentAssertions;
using Frontend.Vanilla.Features.EntryWeb.Prerender;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.EntryWeb.Prerender;

public class PrerenderDetectorTests
{
    private IPrerenderDetector target;
    private HeaderDictionary requestHeaders;

    public PrerenderDetectorTests()
    {
        var httpContextAccessor = new Mock<IHttpContextAccessor>();
        target = new PrerenderDetector(httpContextAccessor.Object);

        requestHeaders = new HeaderDictionary { { "X-Foo", "Bar" } };
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Headers).Returns(requestHeaders);
    }

    [Theory]
    [InlineData(null, false)]
    [InlineData("", false)]
    [InlineData("  ", false)]
    [InlineData("0", false)]
    [InlineData("true", false)]
    [InlineData("1", true)]
    public void ShouldCalculateBasedOnHeader(string headerValue, bool expected)
    {
        requestHeaders.Add(PrerenderDetector.RequestFromPrerenderServiceHeader, headerValue);

        // Act
        target.IsRequestFromPrerenderService.Should().Be(expected);
    }

    [Theory]
    [InlineData("1", "0")]
    [InlineData("0", "1")]
    [InlineData("", "1")]
    [InlineData(null, "1")]
    public void ShouldReturnFalse_IfConflictingHeaders(params string[] values)
    {
        requestHeaders.Add(PrerenderDetector.RequestFromPrerenderServiceHeader, values);

        // Act
        target.IsRequestFromPrerenderService.Should().BeFalse();
    }

    [Fact]
    public void ShouldReturnFalse_IfMissingHeader()
        => target.IsRequestFromPrerenderService.Should().BeFalse();
}
