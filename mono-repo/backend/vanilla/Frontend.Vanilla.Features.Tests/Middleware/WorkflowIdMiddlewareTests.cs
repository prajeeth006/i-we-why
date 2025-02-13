using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.Middleware;
using Frontend.Vanilla.Features.PlaceholderReplacers;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Middleware;

public class WorkflowIdMiddlewareTests
{
    private Features.WebAbstractions.Middleware target;
    private Mock<RequestDelegate> next;
    private Mock<IEndpointMetadata> endpointMetadata;
    private Mock<ILoginService> loginService;
    private Mock<IProductPlaceholderReplacer> productPlaceholderReplacer;
    private DefaultHttpContext ctx;

    public WorkflowIdMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        loginService = new Mock<ILoginService>();
        productPlaceholderReplacer = new Mock<IProductPlaceholderReplacer>();
        target = new WorkflowIdMiddleware(next.Object, endpointMetadata.Object, loginService.Object, productPlaceholderReplacer.Object);

        ctx = new DefaultHttpContext();

        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        ctx.User.AddClaim(PosApiClaimTypes.WorkflowTypeId, "66");
        ctx.Request.Path = "/some-page";
        productPlaceholderReplacer.Setup(x => x.ReplaceAsync(It.IsAny<ExecutionMode>(), It.IsAny<string>())).ReturnsAsync((ExecutionMode em, string x) => x);
    }

    private Task Act() => target.InvokeAsync(ctx);

    [Fact]
    public async Task ShouldRedirect()
    {
        loginService.Setup(o => o.GetNextPostLoginRedirectAsync(It.IsAny<ExecutionMode>()))
            .ReturnsAsync(KeyValue.Get("bla", new PostLoginRedirect { Url = "http://same.as.me/target-page" }));

        await Act();

        ctx.Response.VerifyRedirect("http://same.as.me/target-page");
        ctx.Response.Headers[HttpHeaders.XRedirectSource].Should().BeEquivalentTo("bla");
        next.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ShouldDoNothing_IfNotServingHtml()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(false);
        await RunNoRedirectTest();
    }

    [Theory, BooleanData]
    public async Task ShouldDoBothing_IfNotInWorkflow(bool hasNoClaim)
    {
        ctx.User.SetOrRemoveClaim(PosApiClaimTypes.WorkflowTypeId, hasNoClaim ? null : "0");
        await RunNoRedirectTest();
    }

    [Fact]
    public async Task ShouldDoNothing_IfUrlPathInWhiteList()
    {
        loginService.Setup(o => o.IsInWorkflowUrlWhiteList("/some-page")).Returns(true);
        await RunNoRedirectTest();
    }

    [Fact]
    public async Task ShouldDoNothing_IfThereIsNoNextRedirect()
    {
        loginService.Setup(o => o.GetNextPostLoginRedirectAsync(default)).ReturnsAsync(null);
        await RunNoRedirectTest();
    }

    [Fact]
    public async Task ShouldDoNothing_IfNoRedirectUrl()
    {
        loginService.Setup(o => o.GetNextPostLoginRedirectAsync(default)).ReturnsAsync(KeyValue.Get("bla", new PostLoginRedirect()));
        await RunNoRedirectTest();
    }

    [Fact]
    public async Task ShouldDoNothing_IfItIsSameRequestUrl()
    {
        loginService.Setup(o => o.GetNextPostLoginRedirectAsync(default))
            .ReturnsAsync(KeyValue.Get("bla", new PostLoginRedirect { Url = "http://same.as.me/some-page?q=1" }));
        await RunNoRedirectTest();
    }

    private async Task RunNoRedirectTest()
    {
        await Act();

        next.Verify(n => n(ctx));
        ctx.Response.VerifyNotChanged();
    }
}
