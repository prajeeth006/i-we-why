#nullable enable

using System.Linq;
using System.Security.Claims;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Visitor;

public class LastVisitorLoginFilterTests
{
    private readonly LoginFilter target;
    private readonly Mock<ILastVisitorCookie> cookie;
    private readonly AuthenticationConfiguration config;
    private readonly Mock<IHttpContextAccessor> httpContextAccessor;
    private readonly TestLogger<LastVisitorLoginFilter> log;

    private readonly AfterLoginContext ctx;

    public LastVisitorLoginFilterTests()
    {
        cookie = new Mock<ILastVisitorCookie>();
        config = new AuthenticationConfiguration();
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        log = new TestLogger<LastVisitorLoginFilter>();
        target = new LastVisitorLoginFilter(cookie.Object, config, httpContextAccessor.Object, log);

        ctx = new AfterLoginContext(default, new PosApiRestRequest(new PathRelativeUri("path")), null!);

        httpContextAccessor.SetupGet(a => a.HttpContext!.User).Returns(new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(PosApiClaimTypes.Name, "Chuck Norris"),
            new Claim(PosApiClaimTypes.BwinAccountId, "666"),
            new Claim(PosApiClaimTypes.Email, "gmail@chuck-norris.com"),
        })));
        config.EligibleLoginNameClaimTypes = new[]
        {
            PosApiClaimTypes.Name,
            PosApiClaimTypes.Email,
        };
    }

    private void Act() => target.AfterLogin(ctx);

    [Theory]
    [InlineData("Chuck Norris", "Chuck Norris")]
    [InlineData("chUCK NORris", "Chuck Norris")] // Different letter casing
    [InlineData("  Chuck Norris", "Chuck Norris")] // Not trimmed
    [InlineData("gmail@chuck-norris.com", "gmail@chuck-norris.com")]
    public void ShouldSetFromInputParameters_IfMatchesConfig(string input, string expected)
    {
        SetupRequestUsername(input);

        Act();

        cookie.Verify(c => c.SetValue(expected));
        log.VerifyNothingLogged();
    }

    [Fact]
    public void ShouldSetFromInputParameters_AndLogError_IfNotInConfig()
    {
        SetupRequestUsername("\rBruce Lee  ");

        Act();

        cookie.Verify(c => c.SetValue("Bruce Lee"));
        log.Logged.Single().Verify(
            LogLevel.Error,
            ("inputUsername", "Bruce Lee"),
            ("eligibleClaims", $"{PosApiClaimTypes.Name}, {PosApiClaimTypes.Email}"),
            ("dynaConFeature", AuthenticationConfiguration.FeatureName));
    }

    [Theory, BooleanData]
    public void ShouldSetFromUser_IfNotInParameters(bool nullParams)
    {
        ctx.Request.Content = nullParams ? null : new PidLoginParameters("123");

        Act();

        cookie.Verify(c => c.SetValue("Chuck Norris"));
        log.VerifyNothingLogged();
    }

    [Theory, BooleanData]
    public void ShouldNotSetAnything_IfNoInputUsername(bool nullParams)
    {
        ctx.Request.Content = nullParams ? null : new PidLoginParameters("123");
        httpContextAccessor.SetupGet(a => a.HttpContext!.User).Returns(new ClaimsPrincipal(new ClaimsIdentity()));

        Act();

        cookie.VerifyNoOtherCalls();
        log.Logged.Single().Verify(
            LogLevel.Warning,
            ("loginParameters", nullParams ? null : typeof(PidLoginParameters).ToString()));
    }

    private void SetupRequestUsername(string username)
        => ctx.Request.Content = new LoginParameters(username, "pwd");
}
