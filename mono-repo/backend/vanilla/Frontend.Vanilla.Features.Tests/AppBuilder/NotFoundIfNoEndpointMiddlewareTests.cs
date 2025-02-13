using System.IO;
using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.AppBuilder;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.AppBuilder;

public class NotFoundIfNoEndpointMiddlewareTests
{
    private readonly NotFoundIfNoEndpointMiddleware target;
    private readonly Mock<RequestDelegate> next;
    private readonly Mock<IInternalRequestEvaluator> internalRequestEvaluator;
    private readonly DefaultHttpContext httpContext;

    public NotFoundIfNoEndpointMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        internalRequestEvaluator = new Mock<IInternalRequestEvaluator>();
        target = new NotFoundIfNoEndpointMiddleware(next.Object, internalRequestEvaluator.Object);

        httpContext = new DefaultHttpContext();
        httpContext.Response.Body = new MemoryStream();
    }

    [Fact]
    public async Task ShouldRespondWithNotFound_IfNoEndpoint()
    {
        // Act
        await target.InvokeAsync(httpContext);

        httpContext.Response.StatusCode.Should().Be((int)HttpStatusCode.NotFound);
        httpContext.Response.Body.Length.Should().Be(0);
        next.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ShouldResponseWithDiagnosticMessage_IfInternalRequest()
    {
        internalRequestEvaluator.Setup(e => e.IsInternal()).Returns(true);

        // Act
        await target.InvokeAsync(httpContext);

        httpContext.Response.StatusCode.Should().Be((int)HttpStatusCode.NotFound);
        httpContext.Response.ContentType.Should().Be(ContentTypes.Text);
        ((MemoryStream)httpContext.Response.Body).ToArray().DecodeToString().Should().Contain("No route");
        next.VerifyNoOtherCalls();
    }

    [Fact]
    public void ShouldPassToNext_IfEndpointExists()
    {
        var nextTask = TestTask.GetUnique();
        httpContext.SetEndpoint(new Endpoint(_ => Task.CompletedTask, null, null));
        next.Setup(n => n(httpContext)).Returns(nextTask);

        // Act
        var task = target.InvokeAsync(httpContext);

        task.Should().BeSameAs(nextTask);
        httpContext.Response.StatusCode.Should().Be((int)HttpStatusCode.OK);
        httpContext.Response.Body.Length.Should().Be(0);
    }
}
