using System;
using System.Net;
using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Features.EntryWeb.Prerender;
using Frontend.Vanilla.Features.Routing;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class RequestDslProviderTests
{
    private IRequestDslProvider target;
    private Mock<IBrowserUrlProvider> browserUrlProvider;
    private Mock<IInternalRequestEvaluator> requestEvaluator;
    private Mock<IPrerenderDetector> prerenderDetector;
    private Mock<IClientIPResolver> clientIPResolver;
    private Mock<IRequestDslRedirector> requestDslRedirector;
    private Mock<IHttpContextAccessor> httpContextAccessor;

    public RequestDslProviderTests()
    {
        browserUrlProvider = new Mock<IBrowserUrlProvider>();
        requestEvaluator = new Mock<IInternalRequestEvaluator>();
        prerenderDetector = new Mock<IPrerenderDetector>();
        clientIPResolver = new Mock<IClientIPResolver>();
        requestDslRedirector = new Mock<IRequestDslRedirector>();
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        target = new RequestDslProvider(
            browserUrlProvider.Object,
            requestEvaluator.Object,
            prerenderDetector.Object,
            clientIPResolver.Object,
            requestDslRedirector.Object,
            httpContextAccessor.Object);

        browserUrlProvider.SetupGet(r => r.Url).Returns(new HttpUri("http://www.acme.com/en-us/controller/action?some=query"));
    }

    [Fact]
    public void AbsoluteUri_ShouldGetFromBrowserUrl()
        => target.AbsoluteUri.Should().Be("http://www.acme.com/en-us/controller/action?some=query");

    [Fact]
    public void Host_ShouldGetFromBrowserUrl()
        => target.Host.Should().Be("www.acme.com");

    [Fact]
    public void AbsolutePath_ShouldGetFromBrowserUrl()
        => target.AbsolutePath.Should().Be("/en-us/controller/action");

    [Fact]
    public void PathAndQuery_ShouldGetFromBrowserUrl()
        => target.PathAndQuery.Should().Be("/en-us/controller/action?some=query");

    [Fact]
    public void Query_ShouldGetFromBrowserUrl()
        => target.Query.Should().Be("?some=query");

    [Theory, ValuesData(null, "wtf")]
    public void CultureToken_ShouldGetFromRouteValues(string value)
    {
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.RouteValues).Returns(new RouteValueDictionary { { RouteValueKeys.Culture, value } });

        // Act
        target.CultureToken.Should().Be(value);
    }

    [Fact]
    public void CultureToken_ShouldThrow_IfInvalidRouteValue()
    {
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.RouteValues).Returns(new RouteValueDictionary { { RouteValueKeys.Culture, 123 } });

        // Act
        target.Invoking(t => t.CultureToken).Should().Throw<InvalidCastException>();
    }

    [Fact]
    public void CultureToken_ShouldThrow_IfNotHttpContext()
        => target.Invoking(t => t.CultureToken).Should().Throw<NoHttpContextException>();

    [Theory, BooleanData]
    public void IsInternal_ShouldDelegate(bool value)
    {
        requestEvaluator.Setup(e => e.IsInternal()).Returns(value);
        target.IsInternal.Should().Be(value); // Act
    }

    [Theory, BooleanData]
    public void IsPrerendered_ShouldDelegate(bool value)
    {
        prerenderDetector.SetupGet(d => d.IsRequestFromPrerenderService).Returns(value);
        target.IsPrerendered.Should().Be(value); // Act
    }

    [Fact]
    public void ClientIP_ShouldDelegate()
    {
        clientIPResolver.Setup(r => r.Resolve()).Returns(IPAddress.Parse("1.2.3.4"));
        target.ClientIP.Should().Be("1.2.3.4"); // Act
    }

    [Fact]
    public void RedirectSimple_ShouldDelegate()
    {
        target.Redirect("/page"); // Act
        requestDslRedirector.Verify(r => r.Redirect("/page", false, false));
    }

    [Theory]
    [InlineData(false, false)]
    [InlineData(false, true)]
    [InlineData(true, false)]
    [InlineData(true, true)]
    public void RedirectWithDetails_ShouldDelegate(bool permanent, bool preserveQuery)
    {
        target.Redirect("/page", permanent, preserveQuery); // Act
        requestDslRedirector.Verify(r => r.Redirect("/page", permanent, preserveQuery));
    }
}
