using Frontend.Host.Features.AuthRequired;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.AuthRequired;

public sealed class AuthRequiredMiddlewareTests
{
    private readonly Middleware target;
    private readonly Mock<RequestDelegate> next;
    private readonly Mock<IAuthorizationConfiguration> authorizationConfiguration;
    private readonly Mock<IEndpointMetadata> endpointMetadata;
    private readonly Mock<ICultureUrlTokenResolver> cultureUrlTokerResolver;
    private readonly Mock<ILanguageService> languageService;

    private readonly DefaultHttpContext ctx;

    public AuthRequiredMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        authorizationConfiguration = new Mock<IAuthorizationConfiguration>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        cultureUrlTokerResolver = new Mock<ICultureUrlTokenResolver>();
        languageService = new Mock<ILanguageService>();
        ctx = new DefaultHttpContext();

        target = new AuthRequiredMiddleware(
            next.Object,
            authorizationConfiguration.Object,
            endpointMetadata.Object,
            cultureUrlTokerResolver.Object,
            languageService.Object);
        ctx.Request.Scheme = "https";
        ctx.Request.Host = new HostString("londoncalling");
        ctx.Request.Path = "/newyear/test";

        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        authorizationConfiguration.SetupGet(c => c.AuthRequired).Returns(new[] { "last/url", "newyear/*" });
        cultureUrlTokerResolver.Setup(c => c.GetToken(It.IsAny<HttpContext>()))
            .Returns(("eng", CultureUrlTokenSource.RouteValues));
    }

    private Task Act() => target.InvokeAsync(ctx);

    [Fact]
    public async Task ShouldNotExecute_IfPathIsEmpty()
    {
        ctx.Request.Path = string.Empty;
        await Act();
    }

    [Fact]
    public async Task ShouldNotExecute_IfPathContainsLoginUrl()
    {
        ctx.Request.Path = "/labelhost/login";
        await RunNoRedirectTest();
    }

    [Fact]
    public async Task ShouldNotExecute_IfUserAuthenticated()
    {
        ctx.User = TestUser.Get(AuthState.Authenticated);
        await RunNoRedirectTest();
    }

    [Fact]
    public async Task ShouldNotExecute_IfNotHtmlDocument()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(false);
        await RunNoRedirectTest();
    }

    [Fact]
    public async Task ShouldNotExecute_IfConfigEmpty()
    {
        authorizationConfiguration.SetupGet(c => c.AuthRequired)
            .Returns(Array.Empty<string>());
        await RunNoRedirectTest();
    }

    [Fact]
    public async Task ShouldNotRedirect_IfPathDoesntMatch()
    {
        ctx.Request.Path = "/nomatch/test";
        await RunNoRedirectTest();
    }

    [Fact]
    public async Task ShouldRedirect302_IfPathMatch()
    {
        await Act();

        ctx.Response.VerifyRedirect($"/eng/labelhost/login?rurlauth=1&rurl=https%3A%2F%2Flondoncalling%2Fnewyear%2Ftest", false);
        next.Verify(n => n(ctx));
    }

    private async Task RunNoRedirectTest()
    {
        await Act();

        next.Verify(n => n(ctx));
        ctx.Response.VerifyNotChanged();
    }
}
