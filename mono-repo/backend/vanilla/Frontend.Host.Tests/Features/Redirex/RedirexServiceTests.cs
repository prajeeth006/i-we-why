using System.Net;
using System.Text;
using FluentAssertions;
using Frontend.Host.Features.Redirex;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.AspNetCore.Http;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Host.Tests.Features.Redirex;

public class RedirexServiceTests
{
    private readonly CancellationToken ct;
    private readonly RedirexConfiguration config;
    private readonly Mock<IRestClient> restClient;
    private readonly IRedirexService target;

    public RedirexServiceTests()
    {
        restClient = new Mock<IRestClient>();
        config = new RedirexConfiguration
        {
            Enabled = true,
            ServiceUrl = new Uri("https://service.prerender.io/"),
            RequestTimeout = TimeSpan.FromSeconds(666),
        };
        target = new RedirexService(restClient.Object, config);

        ct = TestCancellationToken.Get();
    }

    [Fact]
    public async Task ShouldPostCorrectly()
    {
        var expected = new RedirexResponse();
        var response = new RestResponse(new RestRequest(new HttpUri("http://test")))
        {
            StatusCode = HttpStatusCode.OK,
            Content = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(expected)),
        };
        restClient.SetupWithAnyArgs(c => c.ExecuteAsync(It.IsAny<RestRequest>(), TestContext.Current.CancellationToken)).ReturnsAsync(response);

        var request = new RedirexRequestData();

        // Act
        var redirexResponse = await target.PostAsync(request, ct);

        redirexResponse.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public async Task PostShouldReturnNull()
    {
        var response = new RestResponse(new RestRequest(new HttpUri("http://test")))
        {
            StatusCode = HttpStatusCode.MovedPermanently,
        };
        restClient.SetupWithAnyArgs(c => c.ExecuteAsync(It.IsAny<RestRequest>(), TestContext.Current.CancellationToken)).ReturnsAsync(response);

        // Act
        var redirexResponse = await target.PostAsync(new RedirexRequestData(), ct);

        redirexResponse.Should().BeNull();
    }

    [Fact]
    public void ShouldSkip()
    {
        var httpContext = new DefaultHttpContext();
        httpContext.Request.Headers.Append(RedirexService.SkipHeaderName, "foo");
        // Act
        var shouldSkip = target.ShouldSkip(httpContext);

        shouldSkip.Should().BeTrue();
    }

    [Fact]
    public void ShouldNotSkip()
    {
        var httpContext = new DefaultHttpContext();
        // Act
        var shouldSkip = target.ShouldSkip(httpContext);

        shouldSkip.Should().BeFalse();
    }
}
