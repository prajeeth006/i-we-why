using System;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Authentication;

public class AuthenticatedClaimsInitializerTests
{
    private readonly IAuthenticatedClaimsInitializer target;
    private readonly Mock<IWebAuthenticationService> authenticationService;
    private readonly Mock<IPosApiAuthenticationServiceInternal> posApiAuthenticationService;
    private readonly Mock<IEndpointMetadata> endpointMetadata;
    private readonly Mock<IAuthenticationHelper> authenticationHelper;
    private readonly TestLogger<AuthenticatedClaimsInitializer> log;

    private readonly CancellationToken ct;
    private CookieValidatePrincipalContext ctx;

    public AuthenticatedClaimsInitializerTests()
    {
        authenticationService = new Mock<IWebAuthenticationService>();
        posApiAuthenticationService = new Mock<IPosApiAuthenticationServiceInternal>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        authenticationHelper = new Mock<IAuthenticationHelper>();
        log = new TestLogger<AuthenticatedClaimsInitializer>();
        target = new AuthenticatedClaimsInitializer(
            authenticationService.Object,
            posApiAuthenticationService.Object,
            endpointMetadata.Object,
            authenticationHelper.Object,
            log);

        ct = TestCancellationToken.Get();
        ctx = SetupContext();
    }

    [Theory]
    [BooleanData]
    public async Task ShouldReplaceWithClaimsPrincipal(bool servesHtmlDocument)
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(servesHtmlDocument);
        var authUser = new ClaimsPrincipal(new ClaimsIdentity());
        posApiAuthenticationService
            .Setup(s => s.SetupUserAsync(new PosApiAuthTokens("ut", "st"), servesHtmlDocument, ct))
            .ReturnsAsync(authUser);

        // Act
        await target.SetupClaimsAsync(ctx);

        ctx.Principal.Should().BeSameAs(authUser);
        ctx.ShouldRenew.Should().BeFalse();
        authenticationService.VerifyWithAnyArgs(s => s.RefreshTokenAsync(default, TestContext.Current.CancellationToken), Times.Never);
        log.VerifyNothingLogged();
    }

    [Theory]
    [InlineData(true, true, false)]
    [InlineData(true, true, true)]
    [InlineData(true, null, true)]
    [InlineData(false, false, true)]
    [InlineData(false, false, false)]
    [InlineData(false, null, false)]
    public async Task ShouldRenewAuth_IfExplicitMetadataOrSecondHalfOfExpiration(bool expected, bool? shouldRenewAuth, bool isSecondHalfOfExpiration)
    {
        if (shouldRenewAuth != null)
            endpointMetadata.Setup(m => m.Get<IRenewAuthenticationMetadata>())
                .Returns(Mock.Of<IRenewAuthenticationMetadata>(m => m.ShouldRenew == shouldRenewAuth.Value));
        authenticationHelper.Setup(m => m.IsSecondHalfOfExpiration(It.IsAny<AuthenticationProperties>()))
            .Returns(isSecondHalfOfExpiration);

        // Act
        await target.SetupClaimsAsync(ctx);

        ctx.ShouldRenew.Should().Be(expected);
        authenticationService.Verify(s => s.RefreshTokenAsync(true, ct), Times.Exactly(expected ? 1 : 0));
        log.VerifyNothingLogged();
    }

    [Theory]
    [MemberValuesData(nameof(UserIdentityKey.AuthExpiredPosApiCodes), MemberType = typeof(UserIdentityKey))]
    public async Task ShouldFallbackToAnonymousUser_IfExpiredOnPosApi(int posApiCode)
    {
        var ex = new PosApiException(posApiCode: posApiCode);
        posApiAuthenticationService.SetupWithAnyArgs(s => s.SetupUserAsync(null!, false, TestContext.Current.CancellationToken)).ThrowsAsync(ex);

        // Act
        await target.SetupClaimsAsync(ctx);

        ctx.Principal.Should().BeNull();
        posApiAuthenticationService.Verify(o => o.SetupAnonymousUserAsync(ct));
        log.Logged.Single().Verify(LogLevel.Warning, ex, ("userToken", "ut"), ("sessionToken", "st"));
    }

    [Fact]
    public void ShouldThrow_IfSomethingFailed()
    {
        var testEx = new Exception("Oups");
        posApiAuthenticationService.SetupWithAnyArgs(s => s.SetupUserAsync(null!, false, TestContext.Current.CancellationToken)).ThrowsAsync(testEx);

        RunFailedTest(ctx, ex => ex == testEx);
    }

    private void RunFailedTest(CookieValidatePrincipalContext context, Expression<Func<Exception, bool>> verifyInnerEx)
    {
        var act = () => target.SetupClaimsAsync(context);

        act.Should().ThrowAsync<Exception>().Result
            .WithMessage("Failed to set up claims for user UserToken='ut', SessionToken='st'.")
            .And.InnerException.Should().Match(verifyInnerEx);
    }

    private CookieValidatePrincipalContext SetupContext()
    {
        var httpContext = new Mock<HttpContext>();
        httpContext.SetupGet(c => c.RequestAborted).Returns(ct);
        var authServiceMock = new Mock<IAuthenticationService>();
        authServiceMock.Setup(x => x.SignOutAsync(It.IsAny<HttpContext>(), It.IsAny<string>(), It.IsAny<AuthenticationProperties>())).Returns(Task.FromResult("dummy"));
        var serviceProviderMock = new Mock<IServiceProvider>();
        serviceProviderMock.Setup(x => x.GetService(typeof(IAuthenticationService))).Returns(authServiceMock.Object);
        httpContext.Setup(x => x.RequestServices).Returns(serviceProviderMock.Object);

        var user = new ClaimsPrincipal(Mock.Of<IIdentity>(i => i.Name == "ut:st"));
        var authProps = new AuthenticationProperties();
        var scheme = new AuthenticationScheme("Cookies", "Cookies", typeof(IAuthenticationHandler));

        return ctx = new CookieValidatePrincipalContext(
            httpContext.Object,
            scheme,
            new CookieAuthenticationOptions(),
            new AuthenticationTicket(user, authProps, "Cookies"));
    }
}
