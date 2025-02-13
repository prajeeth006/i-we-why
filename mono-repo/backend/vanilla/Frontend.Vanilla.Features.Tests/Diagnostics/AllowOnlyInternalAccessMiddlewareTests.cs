using System.IO;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.App;
using Frontend.Vanilla.Features.Diagnostics;
using Frontend.Vanilla.Testing;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.He;

public class AllowOnlyInternalAccessMiddlewareTests
{
    private Mock<IInternalRequestEvaluator> internalRequestEvaluator;
    private DefaultHttpContext httpContext;
    private Mock<RequestDelegate> next;
    private Mock<IAppConfiguration> appConfiguration;

    public AllowOnlyInternalAccessMiddlewareTests()
    {
        internalRequestEvaluator = new Mock<IInternalRequestEvaluator>();
        appConfiguration = new Mock<IAppConfiguration>();
        next = new Mock<RequestDelegate>();
        httpContext = new DefaultHttpContext();

        httpContext.Request.Path = "/health";
        httpContext.Response.Body = new MemoryStream();
        appConfiguration.Setup(e => e.AllowOnlyInternallyPaths).Returns(["/metrics", "/health", "/docs", "/site", "/swagger"]);

        internalRequestEvaluator.Setup(e => e.IsInternal()).Returns(true);
    }

    private Task Act()
    {
        var target = new AllowOnlyInternalAccessMiddleware(next.Object, internalRequestEvaluator.Object, appConfiguration.Object);

        return target.InvokeAsync(httpContext);
    }

    [Theory]
    [InlineData(["/health"])]
    [InlineData(["/metrics"])]
    [InlineData(["/docs"])]
    public async Task ShouldReturnForbidden_IfNotInternalRequest(string requestPath)
    {
        httpContext.Request.Path = requestPath;
        internalRequestEvaluator.Setup(e => e.IsInternal()).Returns(false);
        await RunErrorMessageTest(StatusCodes.Status403Forbidden, AllowOnlyInternalAccessMiddleware.PublicInternetMessage);
    }

    private async Task RunErrorMessageTest(int expectedCode, string expectedMsg)
    {
        await Act();

        httpContext.Response.StatusCode.Should().Be(expectedCode);
        httpContext.Response.VerifyBody(ContentTypes.Text, expectedMsg);
        next.VerifyNoOtherCalls();
    }

    private async Task RunOnlyHttpCodeTest(int expectedCode)
    {
        await Act();

        httpContext.Response.StatusCode.Should().Be(expectedCode);
        httpContext.Response.Headers.Should().BeEmpty();
        httpContext.Response.VerifyEmptyBody();
        next.VerifyNoOtherCalls();
    }

    [Theory]
    [InlineData(["/health"])]
    [InlineData(["/metrics"])]
    [InlineData(["/docs"])]
    [InlineData(["/"])]
    [InlineData(["/en/page"])]
    public async Task ShouldNotExecute_IfInternalRequest(string requestPath)
    {
        httpContext.Request.Path = requestPath;

        await Act();

        next.Verify(n => n(httpContext));
        httpContext.Response.VerifyNotChanged();
    }

    [Theory]
    [InlineData(["/"])]
    [InlineData(["/en/page"])]
    public async Task ShouldNotExecute_IfDifferentPathAndNoInternal(string requestPath)
    {
        internalRequestEvaluator.Setup(e => e.IsInternal()).Returns(false);
        httpContext.Request.Path = requestPath;

        await Act();

        next.Verify(n => n(httpContext));
        httpContext.Response.VerifyNotChanged();
        next.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ShouldNotExecute_IfNoPathAndNoInternal()
    {
        internalRequestEvaluator.Setup(e => e.IsInternal()).Returns(false);
        httpContext.Request.Path = string.Empty;

        await Act();

        next.Verify(n => n(httpContext));
        httpContext.Response.VerifyNotChanged();
    }
}
