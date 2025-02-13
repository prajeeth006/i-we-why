using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.App;
using Frontend.Vanilla.Features.EntryWeb.Prerender;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.EntryWeb.Prerender;

public class PrerenderServiceTests
{
    private readonly Mock<IAppConfiguration> appConfig;
    private readonly CancellationToken ct;
    private readonly PrerenderConfiguration prerenderConfig;
    private readonly Mock<IRestClient> restClient;
    private readonly IPrerenderService target;
    private const string XForwardedFor = "127.0.0.1";
    private readonly string correlationId = Guid.NewGuid().ToString();

    public PrerenderServiceTests()
    {
        restClient = new Mock<IRestClient>();
        prerenderConfig = new PrerenderConfiguration
        {
            ServiceUrl = new Uri("https://service.prerender.io/"),
            Token = "xyz",
            RequestTimeout = TimeSpan.FromSeconds(666),
        };
        appConfig = new Mock<IAppConfiguration>();
        target = new PrerenderService(restClient.Object, prerenderConfig, appConfig.Object);

        ct = TestCancellationToken.Get();
    }

    [Theory]
    [InlineData(false, "http://bwin.com/?q=1", "https://service.prerender.io/http://bwin.com/?q=1")]
    [InlineData(false, "https://bwin.com/?q=1", "https://service.prerender.io/https://bwin.com/?q=1")]
    [InlineData(true, "http://bwin.com/?q=1", "https://service.prerender.io/https://bwin.com/?q=1")]
    [InlineData(true, "https://bwin.com/?q=1", "https://service.prerender.io/https://bwin.com/?q=1")]
    public async Task ShouldGetPrerenderedPage(bool usesHttps, string pageUrl, string expectedPrerenderUrl)
    {
        var response = new RestResponse(new RestRequest(new HttpUri("http://test")));
        restClient.SetupWithAnyArgs(c => c.ExecuteAsync(null, TestContext.Current.CancellationToken)).ReturnsAsync(response);
        appConfig.SetupGet(c => c.UsesHttps).Returns(usesHttps);

        // Act
        var page = await target.GetPrerenderedPageAsync(new HttpUri(pageUrl), "Chrome 66", XForwardedFor, correlationId, ct);

        page.Should().BeSameAs(response);
        restClient.Invocations.Single().Arguments[0].Should().BeEquivalentTo(new RestRequest(new HttpUri(expectedPrerenderUrl))
        {
            Headers =
            {
                { PrerenderService.TokenHeader, prerenderConfig.Token },
                { HttpHeaders.UserAgent, "Chrome 66" },
                { HttpHeaders.CacheControl, "no-cache" },
                { HttpHeaders.Accept, ContentTypes.HtmlWithUtf8 },
                { HttpHeaders.XForwardedFor, XForwardedFor },
                { HttpHeaders.XCorrelationId, correlationId },
            },
            Timeout = prerenderConfig.RequestTimeout,
            FollowRedirects = false,
        });
    }

    [Fact]
    public async Task ShouldWrapExceptions()
    {
        var networkEx = new Exception("Network error");
        restClient.SetupWithAnyArgs(c => c.ExecuteAsync(null, TestContext.Current.CancellationToken)).ThrowsAsync(networkEx);
        var pageUrl = new HttpUri("http://bwin.com/?q=1");

        Func<Task> act = () => target.GetPrerenderedPageAsync(pageUrl, "Chrome 66", XForwardedFor, correlationId, ct);

        (await act.Should().ThrowAsync<Exception>())
            .Where(e => e.InnerException == networkEx)
            .Which.Message.Should().StartWith("Failed request to Prerender service: GET https://service.prerender.io/http://bwin.com/?q=1");
    }
}
