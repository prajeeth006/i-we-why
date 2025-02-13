using System;
using System.IO;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.GlobalErrorHandling;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.AspNetCore;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.GlobalErrorHandling;

public class GlobalErrorHandlerTests
{
    private IGlobalErrorHandler target;
    private Mock<IInternalRequestEvaluator> internalRequestEvaluator;
    private TestLogger<GlobalErrorHandler> log;

    private ExecutionMode mode;
    private DefaultHttpContext httpContext;
    private Exception testEx;
    private string errorId;

    public GlobalErrorHandlerTests()
    {
        internalRequestEvaluator = new Mock<IInternalRequestEvaluator>();
        log = new TestLogger<GlobalErrorHandler>();
        target = new GlobalErrorHandler(internalRequestEvaluator.Object, log);

        mode = TestExecutionMode.Get();
        testEx = new Exception("Oups");
        httpContext = new DefaultHttpContext();
        httpContext.Response.Body = new MemoryStream();
    }

    private async Task RunTest(bool expectedHandled)
    {
        // Act
        var handled = await target.HandleAsync(mode, testEx, httpContext);

        handled.Should().Be(expectedHandled);

        var logged = log.Logged[0];
        logged.Level.Should().Be(LogLevel.Error);
        logged.Exception.Should().BeSameAs(testEx);
        errorId = logged.Data.Should().HaveCount(1)
            .And.ContainKey("errorId")
            .WhoseValue.Should().BeOfType<string>()
            .Which.Should().MatchRegex(@"^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$")
            .And.Subject;
    }

    [Fact]
    public async Task ShouldRenderCustomErrorPage()
    {
        await RunTest(expectedHandled: true);

        httpContext.Response.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);
        httpContext.Response.ContentType.Should().Be(ContentTypes.Html);
        httpContext.Response.GetBodyString().Should().BeWellFormedXml().And.Contain(errorId);
        log.Logged.Should().HaveCount(1);
    }

    [Fact]
    public async Task ShouldNotHandle_IfInternalRequest()
    {
        internalRequestEvaluator.Setup(c => c.IsInternal()).Returns(true);

        await RunTest(expectedHandled: false);

        VerifyResponseNotChanged();
        log.Logged.Should().HaveCount(1);
    }

    [Fact]
    public async Task ShouldNotHandle_AndLogWarning_IfResponseStarted()
    {
        httpContext.SetResponseHasStarted();

        await RunTest(expectedHandled: false);

        VerifyResponseNotChanged();
        log.Logged.Should().HaveCount(2);
        log.Logged[1].Verify(LogLevel.Warning, ("errorId", errorId));
    }

    [Fact]
    public async Task ShouldLogException()
    {
        await RunTest(expectedHandled: true);

        httpContext.Response.StatusCode.Should().Be(StatusCodes.Status500InternalServerError);

        log.Logged.Should().HaveCount(1);
        log.Logged[0].Verify(
            LogLevel.Error,
            ex => ex is Exception,
            ("errorId", errorId));
    }

    [Fact]
    public async Task ShouldLogAntiforgeryException()
    {
        testEx = new AntiForgeryValidationException();

        await RunTest(expectedHandled: true);
        httpContext.Response.StatusCode.Should().Be(StatusCodes.Status403Forbidden);

        log.Logged.Should().HaveCount(1);
        log.Logged[0].Verify(
            LogLevel.Error,
            ex => ex is Exception,
            ("errorId", errorId));
    }

    private void VerifyResponseNotChanged()
    {
        httpContext.Response.VerifyNotChanged();
    }
}
