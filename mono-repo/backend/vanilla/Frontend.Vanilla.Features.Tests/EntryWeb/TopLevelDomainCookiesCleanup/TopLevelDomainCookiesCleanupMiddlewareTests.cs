#nullable enable
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.EntryWeb.TopLevelDomainCookies;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.EntryWeb.TopLevelDomainCookiesCleanup;

public class TopLevelDomainCookiesCleanupMiddlewareTests
{
    private Features.WebAbstractions.Middleware target;
    private Mock<RequestDelegate> next;
    private Mock<IEndpointMetadata> endpointMetadata;
    private Mock<ITopLevelDomainCookiesConfiguration> config;
    private Mock<ICookieHandler> cookieHandler;
    private DefaultHttpContext httpContext;
    private CookieLocationOptions options;
    private List<string> cookies;

    public TopLevelDomainCookiesCleanupMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        config = new Mock<ITopLevelDomainCookiesConfiguration>();
        cookieHandler = new Mock<ICookieHandler>();
        target = new TopLevelDomainCookiesCleanupMiddleware(next.Object, endpointMetadata.Object, config.Object, cookieHandler.Object);

        httpContext = new DefaultHttpContext();
        options = new CookieLocationOptions { Domain = CookieDomain.Special, SpecialDomainValue = "sadtrombone.com" };
        cookies = new () { "cookie1", "tracker2" };

        endpointMetadata.Setup(e => e.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        config.SetupGet(c => c.Cleanup).Returns(new CookieDomainConfiguration()
        {
            Cookies = cookies,
            Domain = "sadtrombone.com",
        });
    }

    private Task Act() => target.InvokeAsync(httpContext);
    private void VerifySingleNextInvocation() => next.Verify(n => n(httpContext), Times.Exactly(1));
    private void VerifyCookieDeletionInvocations(int times) => cookieHandler.Verify(c => c.Delete(It.IsIn<string>(cookies), options), Times.Exactly(times));
    private void VerifyNoHeader() => httpContext.Response.Headers.ContainsKey(HttpHeaders.XCookiesCleanup).Should().BeFalse();
    private void VerifyHeader() => httpContext.Response.Headers[HttpHeaders.XCookiesCleanup].Should().Equal("1");

    [Fact]
    public async Task ShouldNotDeleteBecauseNotADocumentRequest()
    {
        endpointMetadata.Setup(e => e.Contains<ServesHtmlDocumentAttribute>()).Returns(false);

        await Act();

        VerifyCookieDeletionInvocations(0);
        VerifyNoHeader();
        VerifySingleNextInvocation();
    }

    [Fact]
    public async Task ShouldNotDeleteBecauseNoCookiesConfigured()
    {
        config.SetupGet(c => c.Cleanup).Returns(new CookieDomainConfiguration()
        {
            Cookies = new List<string>(),
        });

        await Act();

        VerifyCookieDeletionInvocations(0);
        VerifySingleNextInvocation();
    }

    [Fact]
    public async Task ShouldDeleteCookiesAndWriteResponseHeader()
    {
        await Act();

        VerifyCookieDeletionInvocations(cookies.Count);
        VerifyHeader();
        VerifySingleNextInvocation();
    }
}
