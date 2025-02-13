using System;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.Claims;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Claims;

public class ClaimRedirectMiddlewareTests
{
    private Features.WebAbstractions.Middleware target;
    private Mock<RequestDelegate> next;
    private Mock<IEndpointMetadata> endpointMetadata;
    private TestLogger<ClaimRedirectMiddleware> log;
    private DefaultHttpContext httpContext;

    public ClaimRedirectMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        log = new TestLogger<ClaimRedirectMiddleware>();
        target = new ClaimRedirectMiddleware(next.Object, endpointMetadata.Object, log);

        httpContext = new DefaultHttpContext();
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        httpContext.User.SetOrRemoveClaim(PosApiClaimTypes.Redirect, "http://bwin.com/");
    }

    private Task Act() => target.InvokeAsync(httpContext);

    [Fact]
    public async Task ShouldRedirects_IfUseHasRedirectClaim()
    {
        await Act();

        httpContext.Response.VerifyRedirect("http://bwin.com/");
        next.VerifyNoOtherCalls();
        log.VerifyNothingLogged();
    }

    [Theory, ValuesData("", "/rel")]
    public async Task ShouldLogAndPassToNext_IfInvalidUrlInClaim(string claimValue)
    {
        // Skipped for linux because its not invoking httpContext and return status 302
        if (OperatingSystem.IsWindows())
        {
            httpContext.User = new ClaimsPrincipal(new ClaimsIdentity());
            httpContext.User.SetOrRemoveClaim(PosApiClaimTypes.Redirect, claimValue);

            await Act();
            next.Verify(n => n(httpContext));
            httpContext.Response.StatusCode.Should().Be((int)HttpStatusCode.OK);
            log.Logged.Single().Verify(LogLevel.Error, ("claimType", PosApiClaimTypes.Redirect), ("claimValue", claimValue));
        }
    }

    [Fact]
    public async Task ShouldPassToNext_IfNotHtmlDocument()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(false);
        await RunPassToNextTest();
    }

    [Fact]
    public async Task ShouldPassToNext_IfUserHasNoClaim()
    {
        httpContext.User = new ClaimsPrincipal(new ClaimsIdentity());
        await RunPassToNextTest();
    }

    private async Task RunPassToNextTest()
    {
        await Act();

        next.Verify(n => n(httpContext));
        httpContext.Response.StatusCode.Should().Be((int)HttpStatusCode.OK);
        log.VerifyNothingLogged();
    }
}
