using System;
using System.IO;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Diagnostics;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.HealthPages.Api;

public sealed class DiagnosticApiControllerExecutorTests
{
    private IDiagnosticApiControllerExecutor target;
    private Mock<IInternalRequestEvaluator> internalRequestEvaluator;

    private Mock<IDiagnosticApiController> controller;
    private DefaultHttpContext ctx;

    public DiagnosticApiControllerExecutorTests()
    {
        var httpContextAccessor = new Mock<IHttpContextAccessor>();
        internalRequestEvaluator = new Mock<IInternalRequestEvaluator>();
        target = new DiagnosticApiControllerExecutor(httpContextAccessor.Object, internalRequestEvaluator.Object);

        controller = new Mock<IDiagnosticApiController>();
        ctx = new DefaultHttpContext
        {
            Response =
            {
                Body = new MemoryStream(),
            },
        };

        httpContextAccessor.SetupGet(a => a.HttpContext).Returns(ctx);
        internalRequestEvaluator.Setup(e => e.IsInternal()).Returns(true);
    }

    [Fact]
    public async Task ShouldSerializeAndWriteControllerResult()
    {
        controller.Setup(c => c.ExecuteAsync(ctx))
            .Callback(() => ctx.Response.StatusCode = 66)
            .ReturnsAsync(new { Value = 123 });

        await RunAndExpectJson(66, "{ Value: 123 }");
    }

    [Fact]
    public async Task ShouldReturnEmptyResponse_IfNullFromController()
    {
        controller.Setup(c => c.ExecuteAsync(ctx)).ReturnsAsync(() => null);

        // Act
        await target.ExecuteAsync(controller.Object);

        ctx.Response.VerifyEmptyBody();
    }

    [Fact]
    public async Task ShouldReturnForbidden_IfNotInternal()
    {
        internalRequestEvaluator.Setup(e => e.IsInternal()).Returns(false);
        await RunAndExpectJson(StatusCodes.Status403Forbidden, $"{{ Message: '{AllowOnlyInternalAccessMiddleware.PublicInternetMessage}' }}");
    }

    [Fact]
    public async Task ShouldReturnInternalServerError_IfControllerFailed()
    {
        controller.Setup(c => c.ExecuteAsync(ctx)).ThrowsAsync(new Exception("Oups", new Exception("Failed")));
        await RunAndExpectJson(StatusCodes.Status500InternalServerError, $"{{ Message: 'Oups{Environment.NewLine}--> Failed' }}");
    }

    private async Task RunAndExpectJson(int expectedCode, string expectedJson)
    {
        // Act
        await target.ExecuteAsync(controller.Object);

        ctx.Response.StatusCode.Should().Be(expectedCode);
        ctx.Response.ContentType.Should().Be(ContentTypes.Json);
        ((MemoryStream)ctx.Response.Body).ToArray().DecodeToString().Should().BeJson(expectedJson);
    }
}
