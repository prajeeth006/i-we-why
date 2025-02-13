using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.Rest.Formatters;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Rest;

public class TracedRestClientTests : IDisposable
{
    private RestClientBase target;
    private Mock<RestClientBase> inner;
    private Mock<ITraceRecorder> traceProvider;
    private Mock<IHttpClientFactory> httpClientFactory;

    private TestRecordingTrace trace;
    private RestRequest request;
    private ExecutionMode mode;

    public TracedRestClientTests()
    {
        inner = new Mock<RestClientBase>();
        traceProvider = new Mock<ITraceRecorder>();
        httpClientFactory = new Mock<IHttpClientFactory>();

        target = new TracedRestClient(inner.Object, traceProvider.Object, httpClientFactory.Object);

        trace = new TestRecordingTrace();
        request = new RestRequest(new HttpUri("http://api.bwin.com/endpoint?q=1"), HttpMethod.Put)
        {
            Headers = { { "X-Req", "hh1" } },
            Timeout = TimeSpan.FromSeconds(66),
        };
        mode = TestExecutionMode.Get();
        traceProvider.Setup(p => p.GetRecordingTrace()).Returns(trace);
    }

    [Theory]
    [InlineData(null, false)]
    [InlineData(null, true)]
    [InlineData("bwin", false)]
    [InlineData("bwin", true)]
    public async Task ShouldTraceSuccessRequest(string content, bool followRedirects)
    {
        request.Content = content != null ? new RestRequestContent(content, StringFormatter.Singleton) : null;
        request.FollowRedirects = followRedirects;
        var response = new RestResponse(request)
        {
            StatusCode = HttpStatusCode.Conflict,
            Content = "gvc".EncodeToBytes(),
            Headers = { { "X-Res", "hh2" } },
        };
        inner.Setup(i => i.ExecuteAsync(mode, request)).ReturnsAsync(response);

        // Act
        var result = await target.ExecuteAsync(mode, request);

        result.Should().BeSameAs(response);
        VerifyRecorded(content, followRedirects, values: new (string, object)[]
        {
            ("response.status", "409 Conflict"),
            ("response.content", "gvc"),
            ("response.headers", "X-Res='hh2'"),
        });
    }

    [Fact]
    public async Task ShouldTraceFailedRequest()
    {
        var ex = new Exception("Oups");
        inner.Setup(i => i.ExecuteAsync(mode, request)).ThrowsAsync(ex);

        // Act
        Func<Task> act = () => target.ExecuteAsync(mode, request);

        (await act.Should().ThrowAsync<Exception>()).Which.Should().BeSameAs(ex);
        VerifyRecorded(exception: ex, values: ("response.status", "0 NetworkError"));
    }

    private void VerifyRecorded(string content = null, bool followRedirects = true, Exception exception = null, params (string, object)[] values)
        => trace.Recorded.Single().Verify(
            "REST request: PUT http://api.bwin.com/endpoint?q=1",
            exception,
            values.Append(
                    ("request.url", "http://api.bwin.com/endpoint?q=1"),
                    ("request.method", "PUT"),
                    ("request.content", content),
                    ("request.headers", "X-Req='hh1'"),
                    ("request.timeout", TimeSpan.FromSeconds(66)),
                    ("request.followRedirects", followRedirects),
                    ("executionMode", mode.ToString()))
                .ToArray());

    [Fact]
    public void ShouldNotTrace_IfDisabled()
    {
        var responseTask = Task.FromResult(new RestResponse(request));
        inner.Setup(i => i.ExecuteAsync(mode, request)).Returns(responseTask);
        traceProvider.Setup(p => p.GetRecordingTrace()).Returns(() => null);

        // Act
        var task = target.ExecuteAsync(mode, request);

        task.Should().BeSameAs(responseTask);
    }

    public void Dispose()
    {
        traceProvider.Verify(p => p.GetRecordingTrace(), Times.Once);
    }
}
