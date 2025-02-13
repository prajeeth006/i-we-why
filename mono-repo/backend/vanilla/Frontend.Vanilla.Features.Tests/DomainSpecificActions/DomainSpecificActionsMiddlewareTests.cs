using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.DomainSpecificActions;
using Frontend.Vanilla.Features.DomainSpecificActions.Configuration;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DomainSpecificActions;

public class DomainSpecificActionsMiddlewareTests
{
    private Features.WebAbstractions.Middleware target;
    private Mock<RequestDelegate> next;
    private Mock<IEndpointMetadata> endpointMetadata;
    private Mock<IDsaConfiguration> config;
    private Mock<IBrowserUrlProvider> browserUrlProvider;

    private Mock<IDslAction> dslAction;
    private DefaultHttpContext ctx;

    public DomainSpecificActionsMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        config = new Mock<IDsaConfiguration>();
        browserUrlProvider = new Mock<IBrowserUrlProvider>();
        target = new DomainSpecificActionsMiddleware(next.Object, endpointMetadata.Object, config.Object, browserUrlProvider.Object);

        dslAction = new Mock<IDslAction>();
        ctx = new DefaultHttpContext();

        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        config.SetupGet(c => c.HtmlDocumentServerDslAction).Returns(dslAction.Object);
    }

    private Task Act() => target.InvokeAsync(ctx);

    [Fact]
    public async Task ShouldExecuteDslAction()
    {
        await Act();

        ctx.Response.VerifyNotChanged();
        dslAction.Verify(a => a.ExecuteAsync(ctx.RequestAborted));
        next.Verify(n => n(ctx));
    }

    [Theory]
    [MemberData(nameof(GetRedirectTestCases))]
#pragma warning disable xUnit1026 // Theory methods should use all of their parameters
    public async Task ShouldExecuteDslAction_AndRedirect(string description, bool permanent, string url, string expectedUrl)
#pragma warning restore xUnit1026 // Theory methods should use all of their parameters
    {
        var httpUrl = new HttpUri(url);
        browserUrlProvider.SetupGet(p => p.PendingRedirect).Returns(new BrowserUrlRedirect(httpUrl, permanent));

        await Act();

        ctx.Response.VerifyRedirect(expectedUrl, permanent);
        dslAction.Verify(a => a.ExecuteAsync(ctx.RequestAborted));

        next.VerifyNoOtherCalls();
    }

    public static IEnumerable<object[]> GetRedirectTestCases()
    {
        object[] GetTestCase(string description, bool permanent, string url, string expectedUrl) => new object[] { description, permanent, url, expectedUrl };

        yield return GetTestCase("permanent", false, "http://bwin.com/page", "http://bwin.com/page");
        yield return GetTestCase("temporary, no query", true, "http://bwin.com/page", "http://bwin.com/page");
        yield return GetTestCase("temporary, query", false, "http://bwin.com/page?q=1", "http://bwin.com/page?q=1");

        yield return GetTestCase(
            "temporary, query needs encoding",
            false,
            "http://bwin.com/page?a=some text with spaces and &b=c &a=1c",
            $"http://bwin.com/page?a={Uri.EscapeDataString("some text with spaces and ")}&b=c%20&a=1c");

        yield return GetTestCase("temporary, does not double encode",
            false,
            "http://bwin.com/page?a=some%20text%20with%20%26%2C%20spaces%20and%20%2F&b=c%20&a=1c",
            "http://bwin.com/page?a=some%20text%20with%20%26%2C%20spaces%20and%20%2F&b=c%20&a=1c");

        yield return GetTestCase("temporary, does not double encode",
            false,
            "http://example.org/?a=https%3A%2F%2Fqa1.promo.bwin.com%2Fen%2Fpromo%2Fep%2Fc%2Fcoinfliptest%3Fpromoid%3D19491%26promotype%3Dflip_a_coin%26_mode%3Dpreview",
            "http://example.org/?a=https%3A%2F%2Fqa1.promo.bwin.com%2Fen%2Fpromo%2Fep%2Fc%2Fcoinfliptest%3Fpromoid%3D19491%26promotype%3Dflip_a_coin%26_mode%3Dpreview");
    }

    [Fact]
    public async Task ShouldNotDoAnything_IfNotServingHtml()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(false);
        await RunNoExecuteTest();
    }

    [Fact]
    public async Task ShouldNotExecute_IfNoActionConfigured()
    {
        config.SetupGet(c => c.HtmlDocumentServerDslAction).Returns(() => null);
        await RunNoExecuteTest();
    }

    private async Task RunNoExecuteTest()
    {
        await Act();

        next.Verify(n => n(ctx));
        ctx.Response.VerifyNotChanged();
        dslAction.VerifyNoOtherCalls();
    }
}
