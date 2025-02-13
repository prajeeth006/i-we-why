using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Diagnostics.Tracing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.Tracing;

public class WebTraceRecorderTests
{
    private readonly ITraceRecorder target;
    private readonly ILogger<WebTraceRecorder> log;
    private readonly Mock<IHttpContextAccessor> httpContextAccessor;
    private readonly Mock<ICookieHandler> cookieHandler;
    private readonly Mock<IInternalRequestEvaluator> internalRequestEvaluator;
    private readonly DefaultHttpContext httpContext;

    public WebTraceRecorderTests()
    {
        log = Mock.Of<ILogger<WebTraceRecorder>>();
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        cookieHandler = new Mock<ICookieHandler>();
        internalRequestEvaluator = new Mock<IInternalRequestEvaluator>();
        target = new WebTraceRecorder(log, httpContextAccessor.Object, cookieHandler.Object, internalRequestEvaluator.Object, new TestClock());

        httpContext = new DefaultHttpContext
        {
            Request =
            {
                Path = "/page",
            },
        };
        httpContext.Items.Add(CachedChangesetResolver.ItemsKey, "whatever");
        httpContextAccessor.Setup(a => a.HttpContext).Returns(httpContext);
        cookieHandler.Setup(h => h.GetValue(WebTraceRecorder.RecordingCookieName)).Returns("1");
        internalRequestEvaluator.Setup(e => e.IsInternal()).Returns(true);
    }

    [Fact]
    public void GetRecordingTrace_ShouldCreateTrace()
    {
        var trace = target.GetRecordingTrace(); // Act

        trace.Should().BeOfType<WebRecordingTrace>()
            .Which.Logger.Should().BeSameAs(log);
    }

    [Fact]
    public void GetRecordingTrace_ShouldReturnNull_IfNoHttpContext()
    {
        httpContextAccessor.SetupGet(a => a.HttpContext).Returns(() => null);
        RunAndExpectNoRecordingTrace(expectGetCookie: false, expectIsInternalReq: false); // Act
    }

    [Theory, ValuesData("/health/page", "/HEALTH")]
    public void GetRecordingTrace_ShouldReturnNull_IfDiagnosticRequest(string requestPath)
    {
        httpContextAccessor.SetupGet(a => a.HttpContext.Request.Path).Returns(requestPath);
        RunAndExpectNoRecordingTrace(expectGetCookie: false, expectIsInternalReq: false); // Act
    }

    [Fact]
    public void GetRecordingTrace_ShouldReturnNull_IfNoDynaConConfigYet()
    {
        httpContext.Items.Remove(CachedChangesetResolver.ItemsKey);
        RunAndExpectNoRecordingTrace(expectGetCookie: false, expectIsInternalReq: false); // Act
    }

    [Fact]
    public void GetRecordingTrace_ShouldReturnNull_IfNoCookie()
    {
        cookieHandler.Setup(h => h.GetValue(WebTraceRecorder.RecordingCookieName)).Returns(() => null);
        RunAndExpectNoRecordingTrace(expectGetCookie: true, expectIsInternalReq: false); // Act
    }

    [Fact]
    public void GetRecordingTrace_ShouldReturnNull_IfNotInternalRequest()
    {
        internalRequestEvaluator.Setup(e => e.IsInternal()).Returns(false);
        RunAndExpectNoRecordingTrace(expectGetCookie: true, expectIsInternalReq: true); // Act
    }

    private void RunAndExpectNoRecordingTrace(bool expectGetCookie, bool expectIsInternalReq)
    {
        var trace = target.GetRecordingTrace(); // Act

        trace.Should().BeNull();
        cookieHandler.VerifyWithAnyArgs(h => h.GetValue(null), expectGetCookie ? Times.Once() : Times.Never());
        internalRequestEvaluator.Verify(e => e.IsInternal(), expectIsInternalReq ? Times.Once() : Times.Never());
    }

    [Fact]
    public void StartRecording_ShouldSetCookie()
    {
        target.StartRecording(); // Act
        cookieHandler.Verify(h => h.Set(
            WebTraceRecorder.RecordingCookieName,
            It.IsRegex(@"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{7}Z$"),
            new CookieSetOptions { MaxAge = TimeSpan.FromMinutes(5), HttpOnly = true }));
    }

    [Fact]
    public void StopRecording_ShouldRemoveCookie()
    {
        target.StopRecording(); // Act
        cookieHandler.Verify(h => h.Delete(WebTraceRecorder.RecordingCookieName, null));
    }
}
