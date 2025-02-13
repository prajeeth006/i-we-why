using System;
using System.Net.Http;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.RestService;

public class RestServiceCallInfoTests
{
    private readonly UtcDateTime testTime = new UtcDateTime(2032, 3, 15);
    private readonly TimeSpan testDuration = TimeSpan.FromSeconds(666);

    [Theory]
    [InlineData(null, null, null)]
    [InlineData(null, null, "error")]
    [InlineData(null, "response", null)]
    [InlineData(null, "response", "error")]
    [InlineData("request", null, null)]
    [InlineData("request", null, "error")]
    [InlineData("request", "response", null)]
    [InlineData("request", "response", "error")]
    public void ShouldCreateCorrectly(
        string requestContent,
        string responseContent,
        string errorContent)
    {
        var testUrl = new HttpUri("http://api.dynacon/test/path");
        var method = new HttpMethod("FUCK");
        var error = errorContent != null ? new Exception(errorContent) : null;

        // Act
        var call = new RestServiceCallInfo(testUrl, method, testTime, testDuration, requestContent, responseContent, error);

        call.Url.Should().Be(testUrl);
        call.Method.Should().BeSameAs(method);
        call.Time.Should().Be(testTime);
        call.Duration.Should().Be(testDuration);
        call.RequestContent.Should().Be(requestContent);
        call.ResponseContent.Should().Be(responseContent);
        call.Error.Should().Be(error);
    }
}
