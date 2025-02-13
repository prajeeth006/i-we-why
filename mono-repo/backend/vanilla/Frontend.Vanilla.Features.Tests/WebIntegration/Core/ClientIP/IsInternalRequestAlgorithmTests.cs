using System.Collections.Generic;
using System.Net;
using System.Xml.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.WebIntegration.Core.ClientIP;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Core.ClientIP;

public class IsInternalRequestAlgorithmTestsWithTracing() : IsInternalRequestAlgorithmTests(true) { }

public class IsInternalRequestAlgorithmTestsWithoutTracing() : IsInternalRequestAlgorithmTests(false) { }

public abstract class IsInternalRequestAlgorithmTests
{
    private readonly IIsInternalRequestAlgorithm target;
    private readonly Mock<IEnvironmentProvider> envProvider;
    private readonly Mock<ICookieHandler> cookieHandler;
    private readonly Mock<HttpContext> httpContext;
    private readonly List<string> trace;
    private string envName;

    protected IsInternalRequestAlgorithmTests(bool useTrace)
    {
        envProvider = new Mock<IEnvironmentProvider>();
        cookieHandler = new Mock<ICookieHandler>();
        target = new IsInternalRequestAlgorithm(envProvider.Object, cookieHandler.Object);
        httpContext = new Mock<HttpContext>();
        trace = useTrace ? new List<string>() : null;
        envName = "wtf";

        httpContext.SetupGet(r => r.Connection.RemoteIpAddress).Returns(IPAddress.Parse("1.2.3.4"));
        envProvider.SetupGet(e => e.IsProduction).Returns(true);
        envProvider.SetupGet(e => e.Environment).Returns(envName);
    }

    private void RunTest(
        bool expectedIsInternal,
        string expectedReason,
        string clientIp = "1.2.3.4",
        string reportedCookie = "null",
        string reportedIsLocalRequest = "False")
    {
        var clientIpObj = IPAddress.Parse(clientIp);
        var reportedIpType = clientIpObj.IsPrivate() ? "private" : "public";
        var reportedAccessType = expectedIsInternal ? "internal" : "external";

        // Act
        var result = target.Resolve(httpContext.Object, IPAddress.Parse(clientIp), trace);

        result.Should().Be(expectedIsInternal);
        trace?.Should().Equal(
            $"Evaluating if the request is internal based on its physical IP address '{clientIp}',"
            + $" its IsLocal flag with value {reportedIsLocalRequest} according to ASP.NET,"
            + $" resolved client IP address '{clientIp}' which is {reportedIpType}, cookie '{IsInternalRequestAlgorithm.ExternalRequestCookie}' which is {reportedCookie},"
            + $" environment which is '{envName}'.",
            $"Returning {expectedIsInternal} meaning the request is {reportedAccessType} because {expectedReason}.");
    }

    public static readonly IEnumerable<object[]> ClientIpTestCases = new[]
    {
        new object[] { "8.8.8.8", false },
        new object[] { "192.168.1.2", true },
    };

    [Theory, MemberData(nameof(ClientIpTestCases))]
    public void ShouldReturn_BasedOnClientIPBeingPublicOrPrivate(string clientIp, bool expectedIsInternal)
    {
        httpContext.SetupGet(r => r.Connection.RemoteIpAddress).Returns(IPAddress.Parse(clientIp));
        RunTest(
            expectedIsInternal,
            expectedReason: expectedIsInternal ? "client IP is private" : "client IP is public",
            clientIp);
    }

    [Fact]
    public void ShouldReturnTrue_IfNonProductionOrBetaEnvironment()
    {
        envProvider.SetupGet(e => e.IsProduction).Returns(false);
        envProvider.SetupGet(e => e.Environment).Returns(envName = "qa");
        RunTest(
            expectedIsInternal: true,
            expectedReason: "the environment isn't production or beta");
    }

    [Fact]
    public void ShouldReturnTrue_IfLocalRequest()
    {
        httpContext.SetupGet(r => r.Connection.RemoteIpAddress).Returns(IPAddress.Parse("127.0.0.1"));
        RunTest(
            expectedIsInternal: true,
            expectedReason: "the request is local",
            "127.0.0.1",
            reportedIsLocalRequest: "True");
    }

    [Theory]
    [InlineData("TRUE", false)]
    [InlineData("True", false)]
    [InlineData("False", true)]
    [InlineData("Gibberish", true)]
    [InlineData("", true)]
    public void ShouldReturnFalse_IfExternalRequestCookieIsTrue(string cookieValue, bool expectedIsInternal)
    {
        envProvider.SetupGet(e => e.IsProduction).Returns(false);
        envProvider.SetupGet(e => e.Environment).Returns(envName = "qa");
        cookieHandler.Setup(o => o.GetValue(IsInternalRequestAlgorithm.ExternalRequestCookie)).Returns(cookieValue);
        RunTest(
            expectedIsInternal,
            expectedReason: expectedIsInternal ? "the environment isn't production or beta" : "the cookie is True",
            reportedCookie: $"'{cookieValue}'");
    }

    [Fact]
    public void DocumentationHtml_ShouldBeValidXml()
        => XElement.Parse("<root>" + IsInternalRequestAlgorithm.DocumentationHtml + "</root>");
}
