using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Execution;
using Frontend.Vanilla.ServiceClients.Security;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Execution;

public class PosApiRestRequestBuilderTests
{
    private readonly ServiceClientsConfigurationBuilder config;
    private readonly IClientIPResolver clientIPResolver;
    private readonly ICurrentUserAccessor currentUserAccessor;
    private PosApiRestRequest request;
    private RestRequest restRequest;

    public PosApiRestRequestBuilderTests()
    {
        var dslExpressionTrueMock = new Mock<IDslExpression<bool>>();
        dslExpressionTrueMock.Setup(d => d.Evaluate()).Returns(true);
        var dslExpressionFalsyMock = new Mock<IDslExpression<bool>>();
        dslExpressionFalsyMock.Setup(d => d.Evaluate()).Returns(false);
        currentUserAccessor = Mock.Of<ICurrentUserAccessor>();
        clientIPResolver = Mock.Of<IClientIPResolver>(r => r.Resolve() == IPAddress.Parse("1.2.3.4"));
        config = new ServiceClientsConfigurationBuilder
        {
            AccessId = "abc",
            QueryParametersRules = new Dictionary<string, IReadOnlyDictionary<string, ServiceClientQueryParametersRule>>
            {
                [".*"] = new Dictionary<string, ServiceClientQueryParametersRule>
                {
                    ["rule1"] = new ()
                    {
                        Enabled = dslExpressionTrueMock.Object,
                        Parameters = new Dictionary<string, string> { ["param1"] = "rapid", ["param2"] = "sturm" },
                    },
                    ["rule2"] = new ()
                        { Enabled = dslExpressionTrueMock.Object, Parameters = new Dictionary<string, string> { ["param3"] = "lask" } },
                    ["rule3"] = new ()
                        { Enabled = dslExpressionFalsyMock.Object, Parameters = new Dictionary<string, string> { ["param5"] = "red-bull" } },
                },
                ["Wallet.svc"] = new Dictionary<string, ServiceClientQueryParametersRule>
                {
                    ["rule1"] = new ()
                        { Enabled = dslExpressionFalsyMock.Object, Parameters = new Dictionary<string, string> { ["wallet-param"] = "austria" } },
                },
                [".*Kyc.svc/KycStatus.*"] = new Dictionary<string, ServiceClientQueryParametersRule>
                {
                    ["rule1"] = new ()
                        { Enabled = dslExpressionTrueMock.Object, Parameters = new Dictionary<string, string> { ["kyc-param"] = "europe" } },
                },
            },
        };
        currentUserAccessor.User = new ClaimsPrincipal(new ClaimsIdentity());
        request = new PosApiRestRequest(new PathRelativeUri("path"));
        restRequest = new RestRequest(new HttpUri("https://test.com/Kyc.svc/KycStatus"));
    }

    private IPosApiRestRequestBuilder GetTarget()
        => new PosApiRestRequestBuilder(config.Build(), clientIPResolver, currentUserAccessor);

    [Fact]
    public void ShouldConvertRequest()
    {
        config.Headers["x-bwin-test"] = new[] { "xx" };
        config.Headers["x-bwin-test-2"] = new[] { "val-1", "val-2" };
        request.Headers.Add("explicit-header", "eee");

        GetTarget().PrepareRestRequest(restRequest, request); // Act

        restRequest.FollowRedirects.Should().BeTrue();
        restRequest.Headers.Should().Equal(
            new Dictionary<string, StringValues>
            {
                { HttpHeaders.Accept, ContentTypes.Json },
                { PosApiHeaders.ClientIP, "1.2.3.4" },
                { PosApiHeaders.AccessId, "abc" },
                { "x-bwin-test", "xx" },
                { "x-bwin-test-2", new[] { "val-1", "val-2" } },
                { "explicit-header", "eee" },
            });
        restRequest.Content.Should().BeNull();
        restRequest.Url.ToString().Should().Be("https://test.com/Kyc.svc/KycStatus?param1=rapid&param2=sturm&param3=lask&kyc-param=europe");
    }

    [Fact]
    public void ShouldSupportContentBody()
    {
        var person = new Person { Name = "Chuck Norris" };
        request.Content = person;
        GetTarget().PrepareRestRequest(restRequest, request); // Act

        restRequest.Content?.Value.Should().BeSameAs(person);
        restRequest.Content?.Formatter.Should().BeSameAs(PosApiRestClient.Formatter);
    }

    [Fact]
    public void ShouldAddSecurityHeadersOnAuthenticate()
    {
        request.Authenticate = true;
        currentUserAccessor.User = new ClaimsPrincipal(
            new ClaimsIdentity(
                new[]
                {
                    new Claim(PosApiClaimTypes.UserToken, "user-id"),
                    new Claim(PosApiClaimTypes.SessionToken, "session-id"),
                }));

        GetTarget().PrepareRestRequest(restRequest, request); // Act

        restRequest.Headers[PosApiHeaders.UserToken].Should().Equal("user-id");
        restRequest.Headers[PosApiHeaders.SessionToken].Should().Equal("session-id");
    }

    [Fact]
    public void ShouldThrow_IfMissingTokensOnAuthenticate()
    {
        request.Authenticate = true;
        var target = GetTarget();

        var act = () => target.PrepareRestRequest(restRequest, request);

        act.Should().Throw<NotAuthenticatedWithPosApiException>();
    }

    [Theory]
    [InlineData("GET", "Wallet.svc/Balance", "00:00:10")]
    [InlineData("POST", "Wallet.svc/Balance", "00:00:15")]
    [InlineData("GET", "Common.svc/Countries", "00:01:40")]
    public void ShouldSetTimeout_AccordingToConfiguredRules(string method, string url, string expectedTimeout)
    {
        request = new PosApiRestRequest(new PathRelativeUri(url), new HttpMethod(method));
        restRequest = new RestRequest(new HttpUri("http://test/" + url), new HttpMethod(method));

        config.TimeoutRules = new[]
        {
            new ServiceClientTimeoutRule("Wallet.svc/Balance", TimeSpan.FromSeconds(15), new[] { HttpMethod.Post }),
            new ServiceClientTimeoutRule("Wallet.svc/Balance", TimeSpan.FromSeconds(10)),
        };

        GetTarget().PrepareRestRequest(restRequest, request); // Act

        restRequest.Timeout.Should().Be(TimeSpan.Parse(expectedTimeout));
    }

    [Theory]
    [InlineData("GET", "V3/Common.svc/Countries", "V4")]
    [InlineData("GET", "V4/Wallet.svc/Balance", "V3")]
    [InlineData("GET", "V3/Retail.svc/Balance", "V3")]
    public void ShouldOverrideVersion_AccordingToConfiguredEndpoint(string method, string url, string expectedVersion)
    {
        request = new PosApiRestRequest(new PathRelativeUri(url), new HttpMethod(method));
        restRequest = new RestRequest(new HttpUri("http://test/" + url), new HttpMethod(method));

        config.EndpointsV2 = new Dictionary<string, EndpointConfig>
        {
            { "Common.svc", new EndpointConfig() { Version = "V4" } },
            { "Wallet.svc", new EndpointConfig() { Version = "V3" } },
            { "Retail.svc", new EndpointConfig() { Version = "V3" } },
        };

        GetTarget().PrepareRestRequest(restRequest, request); // Act

        restRequest.Url.AbsoluteUri.Should().Contain(expectedVersion);
    }

    private class Person
    {
        public string Name { get; set; }
    }
}
