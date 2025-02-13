using System;
using System.Net;
using System.Net.Http;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Rest;

public sealed class RestRequestTests
{
    private RestRequest target;

    public RestRequestTests()
        => target = new RestRequest(new HttpUri("http://test"));

    [Fact]
    public void Constructor_ShouldSetReasonableDefaults()
        => Verify(HttpMethod.Get);

    [Fact]
    public void Constructor_ShouldSetParametersCorrectly()
    {
        var method = new HttpMethod("FUCK");

        // Act
        target = new RestRequest(new HttpUri("http://test"), method);

        Verify(method);
    }

    private void Verify(HttpMethod expectedMethod)
    {
        target.Url.Should().Be(new HttpUri("http://test"));
        target.Method.Should().Be(expectedMethod);
        target.Headers.Should().BeEmpty();
        target.Content.Should().BeNull();
#pragma warning disable SYSLIB0014 // Type or member is obsolete
        target.Timeout.Should().Be(TimeSpan.FromMilliseconds(WebRequest.Create("http://localhost").Timeout));
#pragma warning restore SYSLIB0014 // Type or member is obsolete
        target.FollowRedirects.Should().BeTrue();
    }

    [Fact]
    public void Url_ShouldSetValue()
    {
        var url = new HttpUri("http://absolute/path");
        target.Url = url;
        target.Url.Should().BeSameAs(url);
    }

    [Fact]
    public void Url_ShouldNotAllowNull()
        => Assert.Throws<ArgumentNullException>(() => target.Url = null);

    [Fact]
    public void Headers_ShouldAcceptRequestHeaders()
    {
        target.Headers.Add(HttpHeaders.Accept, "application/vanilla");
        target.Headers[HttpHeaders.Accept].Should().Equal("application/vanilla");
    }

    [Fact]
    public void Method_ShouldSetValue()
    {
        var method = new HttpMethod("SHIT");
        target.Method = method;
        target.Method.Should().BeSameAs(method);
    }

    [Fact]
    public void Method_ShouldNotAllowNull()
        => Assert.Throws<ArgumentNullException>(() => target.Method = null);

    [Fact]
    public void Headers_ShouldBeCaseInsensitiveByDefault()
    {
        target.Headers.Add("name", "value");
        target.Headers["NAME"].Should().Equal("value");
    }

    [Fact]
    public void Timeout_ShouldSetValue()
    {
        target.Timeout = TimeSpan.FromSeconds(666);
        target.Timeout.Should().Be(TimeSpan.FromSeconds(666));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-666)]
    [InlineData(500)]
    public void Timeout_ShouldNotAllowLessOrEqualThanZero(int ticks)
        => Assert.Throws<ArgumentOutOfRangeException>(() => target.Timeout = TimeSpan.FromTicks(ticks));

    [Fact]
    public void ToString_Test()
        => target.ToString().Should().Be("GET http://test/");
}
