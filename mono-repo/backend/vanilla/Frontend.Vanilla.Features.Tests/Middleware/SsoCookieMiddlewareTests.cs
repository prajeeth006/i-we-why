using System.Collections.Generic;
using System.Security.Claims;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.Middleware;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.ServiceClients.Claims;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Middleware;

public class SsoCookieMiddlewareTests
{
    private BeforeNextMiddleware target;
    private Mock<IEndpointMetadata> endpointMetadata;
    private Mock<ICookieHandler> cookieHandler;
    private DefaultHttpContext httpContext;

    public SsoCookieMiddlewareTests()
    {
        endpointMetadata = new Mock<IEndpointMetadata>();
        cookieHandler = new Mock<ICookieHandler>();
        httpContext = new DefaultHttpContext();
        target = new SsoCookieMiddleware(null, endpointMetadata.Object, cookieHandler.Object);

        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
    }

    private void Act() => target.BeforeNext(httpContext);

    [Fact]
    public void ShouldNotDoAnythingIfNotServingHtml()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(false);

        Act();

        cookieHandler.VerifyNoOtherCalls();
    }

    [Fact]
    public void ShouldAddCookieIfAuthenticated()
    {
        var identity = new ClaimsIdentity(new List<Claim> { new Claim(PosApiClaimTypes.SsoToken, "www") }, authenticationType: "bla");
        httpContext.User = new ClaimsPrincipal(identity);

        Act();

        cookieHandler.Verify(o => o.Set(LoginCookies.SsoToken, "www", new CookieSetOptions { HttpOnly = true }), Times.Once);
    }

    [Fact]
    public void ShouldAddCookieIfNotAuthenticated()
    {
        Act();

        cookieHandler.Verify(o => o.Set(LoginCookies.SsoToken, "www", new CookieSetOptions { HttpOnly = true }), Times.Never);
    }
}
