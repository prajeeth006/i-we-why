using System.Net;
using FluentAssertions;
using Frontend.Host.Features.SignUpBonusRedirect;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.TrackerId;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.ServiceClients.Services.Crm.SignUpBonuses;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.SignUpBonusRedirect;

public class SignUpBonusRedirectMiddlewareTests
{
    private readonly Middleware target;
    private readonly Mock<RequestDelegate> next;
    private readonly Mock<ISignUpBonusResolver> signUpBonusIdResolver;
    private readonly Mock<ISignUpBonusRedirectConfiguration> config;
    private readonly Mock<ISitecoreLinkUrlProvider> sitecoreLinkUrlProvider;
    private readonly Mock<ICookieHandler> cookieHandler;
    private readonly Mock<IEndpointMetadata> endpointMetadata;
    private readonly TestLogger<SignUpBonusRedirectMiddleware> log;
    private readonly DefaultHttpContext ctx;
    private const string TestLinkPath = "App-1.0/Links/SignUpBonus";

    public SignUpBonusRedirectMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        signUpBonusIdResolver = new Mock<ISignUpBonusResolver>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        cookieHandler = new Mock<ICookieHandler>();
        config = new Mock<ISignUpBonusRedirectConfiguration>();
        sitecoreLinkUrlProvider = new Mock<ISitecoreLinkUrlProvider>();
        log = new TestLogger<SignUpBonusRedirectMiddleware>();

        target = new SignUpBonusRedirectMiddleware(
            next.Object,
            endpointMetadata.Object,
            signUpBonusIdResolver.Object,
            config.Object,
            cookieHandler.Object,
            sitecoreLinkUrlProvider.Object,
            log);
        ctx = new DefaultHttpContext();

        endpointMetadata.Setup(e => e.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        config.SetupGet(c => c.LandingPageLinkLocation).Returns(TestLinkPath);
        config.SetupGet(c => c.AlternateRedirectionLink).Returns(TestLinkPath);
        signUpBonusIdResolver.Setup(i => i.GetBonusContentFlow(false)).Returns(new SignUpBonusFlowContent { TrackerId = 666 });
        ctx.Request.Scheme = "https";
        ctx.Request.Host = new HostString("sports.bwin.com");
        ctx.Request.Path = new PathString("/some-page");
        sitecoreLinkUrlProvider.Setup(p => p.GetUrl(TestLinkPath)).Returns(new Uri("https://www.bwin.com/landing-page"));
    }

    private Task Act() => target.InvokeAsync(ctx);

    [Fact]
    public async Task ShouldRedirectToLandingPage()
    {
        await Act();

        Verify(0);
        ctx.Response.StatusCode.Should().Be((int)HttpStatusCode.Redirect);
    }

    [Fact]
    public async Task ShouldNotRedirect_IfAlreadyOnLandingPage()
    {
        ctx.Request.Scheme = "https";
        ctx.Request.Host = new HostString("www.bwin.com");
        ctx.Request.Path = new PathString("/landing-page");

        await Act();

        Verify(1);
    }

    [Fact]
    public async Task ShouldNotRedirectIfSuppressRedirectParamSet()
    {
        ctx.Request.QueryString = ctx.Request.QueryString.Add(SignUpBonusRedirectMiddleware.SuppressBonus, "1");

        await Act();

        Verify(1);
        cookieHandler.Verify(x => x.Set(CookieConstants.SuppressBonusRedirect, "666", new CookieSetOptions { MaxAge = new TimeSpan(3650, 0, 0, 0), HttpOnly = true }));
    }

    [Fact]
    public async Task ShouldNotRedirect_IfNoBonusId()
    {
        signUpBonusIdResolver.Setup(i => i.GetBonusContentFlow(false)).Returns(() => null!);

        await Act();

        Verify(1);
    }

    [Fact]
    public async Task ShouldNotRedirect_IfFailedFetchingBonusId()
    {
        var ex = new Exception();
        signUpBonusIdResolver.Setup(i => i.GetBonusContentFlow(false)).Throws(ex);

        await Act();

        log.Logged.Single().Verify(LogLevel.Error, ex);
        Verify(1);
    }

    [Fact]
    public async Task ShouldNotRedirectIfNotDocumentRequest()
    {
        endpointMetadata.Setup(e => e.Contains<ServesHtmlDocumentAttribute>()).Returns(false);

        await Act();

        Verify(1);
    }

    [Fact]
    public async Task ShouldNotRedirectIfConfigDisabled()
    {
        config.SetupGet(c => c.LandingPageLinkLocation).Returns((string)null!);

        await Act();

        Verify(1);
    }

    private void Verify(int times)
    {
        next.Verify(n => n(ctx), Times.Exactly(times));
        ctx.Response.StatusCode.Should().Be((int)(times == 0 ? HttpStatusCode.Redirect : HttpStatusCode.OK));
    }
}
