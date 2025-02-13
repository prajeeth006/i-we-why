using System.Net;
using System.Security.Claims;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Logging;
using Frontend.Vanilla.Features.Logging.Enrichers;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Moq;
using Serilog.Events;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Logging.Enrichers;

public sealed class HttpContextLogEnricherTests
{
    private readonly HttpContextLogEnricher target;
    private readonly Mock<IHttpContextAccessor> httpContextAccessor;
    private readonly Mock<ICookieHandler> cookieHandler;
    private readonly Mock<IClientIPResolver> clientIpResolver;
    private readonly Mock<IEnvironmentProvider> environmentProvider;
    private readonly LogEvent logEvent;

    public HttpContextLogEnricherTests()
    {
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        cookieHandler = new Mock<ICookieHandler>();
        clientIpResolver = new Mock<IClientIPResolver>();
        environmentProvider = new Mock<IEnvironmentProvider>();
        target = new HttpContextLogEnricher(httpContextAccessor.Object, clientIpResolver.Object, cookieHandler.Object, environmentProvider.Object);

        logEvent = TestLogEvent.Get();
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Host).Returns(new HostString("follow.me", 66));
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.PathBase).Returns("/at");
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Path).Returns("/twitter");
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.QueryString).Returns(new QueryString("?q=1"));
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Method).Returns("GET");
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Headers).Returns(new HeaderDictionary
        {
            { HttpHeaders.Referer, "http://mojakravica.com/mleko" },
            { HttpHeaders.UserAgent, "Skynet 6.6" },
            { HttpContextLogEnricher.EvasionDomainHeader, "bwin66.com" },
        });
        clientIpResolver.Setup(r => r.Resolve()).Returns(IPAddress.Parse("1.2.3.4"));
        cookieHandler.Setup(a => a.GetValue(CookieConstants.NativeApp)).Returns("sportsw");
        cookieHandler.Setup(a => a.GetValue(CookieConstants.ShopId)).Returns("1");
        cookieHandler.Setup(a => a.GetValue(CookieConstants.TerminalId)).Returns("2");
        environmentProvider.SetupGet(a => a.CurrentLabel).Returns("follow.me");
    }

    [Theory]
    [InlineData(false, false)]
    [InlineData(false, true)]
    [InlineData(true, false)]
    [InlineData(true, true)]
    public void ShouldAddPropertiesCorrectly(bool authenticated, bool hasWorkflow)
    {
        httpContextAccessor.SetupGet(a => a.HttpContext.User).Returns(new ClaimsPrincipal(new ClaimsIdentity(
            [
                new Claim(ClaimsIdentity.DefaultNameClaimType, "Chuck Norris"),
                new Claim(hasWorkflow ? PosApiClaimTypes.WorkflowTypeId : "whatever", "123"),
            ],
            authenticated ? "cookies" : null)));

        RunAndExpectProperties(
            httpReferrer: "http://mojakravica.com/mleko",
            nativeApp: "sportsw",
            userName: "Chuck Norris",
            userIsAuthenticated: authenticated,
            userWorkflowType: hasWorkflow ? "123" : null,
            evasionDomain: "bwin66.com",
            userAgent: "Skynet 6.6",
            shopId: "1",
            terminalId: "2");
    }

    private void RunAndExpectProperties(
        string httpReferrer,
        string nativeApp,
        string userName,
        bool userIsAuthenticated,
        string userWorkflowType,
        string evasionDomain,
        string userAgent,
        string shopId,
        string terminalId)
    {
        // Act
        target.Enrich(logEvent, null);

        logEvent.VerifyProperties(
            (LogEventProperties.HttpHostname, "follow.me:66"),
            (LogEventProperties.HttpAbsolutePath, "/at/twitter"),
            (LogEventProperties.HttpQuery, "?q=1"),
            (LogEventProperties.Domain, "follow.me"),
            (LogEventProperties.HttpMethod, "GET"),
            (LogEventProperties.HttpReferrer, httpReferrer),
            (LogEventProperties.HttpUserAgent, userAgent),
            (LogEventProperties.HttpClientIP, "1.2.3.4"),
            (LogEventProperties.UserName, userName),
            (LogEventProperties.UserIsAuthenticated, userIsAuthenticated),
            (LogEventProperties.UserWorkflowType, userWorkflowType),
            (LogEventProperties.NativeApp, nativeApp),
            (LogEventProperties.EvasionDomain, evasionDomain),
            (LogEventProperties.ShopId, shopId),
            (LogEventProperties.TerminalId, terminalId));
    }

    [Fact]
    public void ShouldNotAddProperties_IfNoHttpContext()
    {
        httpContextAccessor.SetupGet(a => a.HttpContext).Returns(() => null);

        target.Enrich(logEvent, null); // Act

        logEvent.Properties.Should().BeEmpty();
    }

    [Fact]
    public void ShouldHandleNulls()
    {
        cookieHandler.Setup(a => a.GetValue(CookieConstants.NativeApp)).Returns((string)null);
        cookieHandler.Setup(a => a.GetValue(CookieConstants.ShopId)).Returns((string)null);
        cookieHandler.Setup(a => a.GetValue(CookieConstants.TerminalId)).Returns((string)null);
        httpContextAccessor.SetupGet(a => a.HttpContext.User).Returns(new ClaimsPrincipal());
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Headers).Returns(new HeaderDictionary());

        RunAndExpectProperties(
            httpReferrer: null,
            nativeApp: null,
            userName: null,
            userIsAuthenticated: false,
            userWorkflowType: null,
            evasionDomain: null,
            userAgent: null,
            shopId: null,
            terminalId: null);
    }
}
