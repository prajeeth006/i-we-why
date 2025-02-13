using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.GlobalErrorHandling;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.GlobalErrorHandling;

public class GlobalErrorHandlingMiddlewareTests
{
    private Features.WebAbstractions.Middleware target;
    private Mock<RequestDelegate> next;
    private Mock<IGlobalErrorHandler> errorHandler;

    private DefaultHttpContext httpContext;
    private Exception testEx;

    public GlobalErrorHandlingMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        errorHandler = new Mock<IGlobalErrorHandler>();
        target = new GlobalErrorHandlingMiddleware(next.Object, errorHandler.Object);

        testEx = new Exception("Oups");
        httpContext = new DefaultHttpContext();

        next.Setup(n => n(httpContext)).ThrowsAsync(testEx);
    }

    private Func<Task> Act => () => target.InvokeAsync(httpContext);

    [Fact]
    public async Task ShouldDelegateToHandler()
    {
        errorHandler.SetupWithAnyArgs(h => h.HandleAsync(default, null, null)).ReturnsAsync(true);

        await Act();

        next.Verify(n => n(httpContext));
        errorHandler.Verify(h => h.HandleAsync(ExecutionMode.Async(httpContext.RequestAborted), testEx, httpContext));
    }

    [Fact]
    public async Task ShouldRethrow_IfNoHandled()
    {
        (await Act.Should().ThrowAsync<Exception>()).Which.Should().BeSameAs(testEx);
        next.Verify(n => n(httpContext));
        errorHandler.Verify(h => h.HandleAsync(ExecutionMode.Async(httpContext.RequestAborted), testEx, httpContext));
    }

    [Fact]
    public async Task ShouldDoNothing_IfNoExceptionFromNext()
    {
        next.Reset();

        await Act();

        errorHandler.VerifyNoOtherCalls();
        next.Verify(n => n(httpContext));
    }
}
