using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching.Tracing;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Caching.Tracing;

public class TracedDistributedCacheTests
{
    private IDistributedCache target;
    private Mock<IDistributedCache> inner;
    private Mock<ITraceRecorder> traceRecorder;

    private TestRecordingTrace trace;
    private CancellationToken ct;
    private byte[] testBytes;
    private Task<byte[]> testTask;
    private (string, object) expectedMode;

    public TracedDistributedCacheTests()
    {
        inner = new Mock<IDistributedCache>();
        traceRecorder = new Mock<ITraceRecorder>();
        target = new TracedDistributedCache(inner.Object, traceRecorder.Object);

        trace = new TestRecordingTrace();
        ct = TestCancellationToken.Get();
        testBytes = Guid.NewGuid().ToByteArray();
        testTask = Task.FromResult(Guid.NewGuid().ToByteArray());
        expectedMode = ("executionMode", ExecutionMode.Async(ct).ToString());
        traceRecorder.Setup(r => r.GetRecordingTrace()).Returns(() => trace);
    }

    [Fact]
    public async Task GetAsync_ShouldRecordTrace()
    {
        inner.Setup(i => i.GetAsync("kk", ct)).ReturnsAsync(testBytes);

        var result = await target.GetAsync("kk", ct); // Act

        result.Should().Equal(testBytes);
        trace.Recorded.Single().Verify(
            "DistributedCache read: kk",
            ("cacheEntry.key", "kk"),
            ("cacheEntry.value", testBytes.DecodeToString()),
            expectedMode);
    }

    [Fact]
    public void GetAsync_ShouldNotTrace_IfDisabled()
    {
        inner.Setup(i => i.GetAsync("kk", ct)).Returns(testTask);
        trace = null;

        var task = target.GetAsync("kk", ct); // Act

        task.Should().BeSameAs(testTask);
    }

    [Fact]
    public async Task SetAsync_ShouldRecordTrace()
    {
        var opts = new DistributedCacheEntryOptions
        {
            AbsoluteExpiration = new DateTimeOffset(2000, 1, 2, 3, 4, 5, TimeSpan.FromHours(0)),
            AbsoluteExpirationRelativeToNow = new TimeSpan(111),
            SlidingExpiration = new TimeSpan(222),
        };

        await target.SetAsync("kk", testBytes, opts, ct); // Act

        inner.Verify(i => i.SetAsync("kk", testBytes, opts, ct));
        trace.Recorded.Single().Verify(
            "DistributedCache write: kk",
            ("cacheEntry.key", "kk"),
            ("cacheEntry.value", testBytes.DecodeToString()),
            ("options.absoluteExpiration", new DateTime(2000, 1, 2, 3, 4, 5, DateTimeKind.Utc)),
            ("options.absoluteExpirationRelativeToNow", new TimeSpan(111)),
            ("options.slidingExpiration", new TimeSpan(222)),
            expectedMode);
    }

    [Fact]
    public void SetAsync_ShouldNotTrace_IfDisabled()
    {
        var opts = new DistributedCacheEntryOptions();
        inner.Setup(i => i.SetAsync("kk", testBytes, opts, ct)).Returns(testTask);
        trace = null;

        var task = target.SetAsync("kk", testBytes, opts, ct); // Act

        task.Should().BeSameAs(testTask);
    }

    [Fact]
    public async Task RefreshAsync_ShouldRecordTrace()
    {
        await target.RefreshAsync("kk", ct); // Act

        inner.Verify(i => i.RefreshAsync("kk", ct));
        trace.Recorded.Single().Verify(
            "DistributedCache refresh: kk",
            ("cacheEntry.key", "kk"),
            expectedMode);
    }

    [Fact]
    public void RefreshAsync_ShouldNotTrace_IfDisabled()
    {
        inner.Setup(i => i.RefreshAsync("kk", ct)).Returns(testTask);
        trace = null;

        var task = target.RefreshAsync("kk", ct); // Act

        task.Should().BeSameAs(testTask);
    }

    [Fact]
    public async Task RemoveAsync_ShouldRecordTrace()
    {
        await target.RemoveAsync("kk", ct); // Act

        inner.Verify(i => i.RemoveAsync("kk", ct));
        trace.Recorded.Single().Verify(
            "DistributedCache removal: kk",
            ("cacheEntry.key", "kk"),
            expectedMode);
    }

    [Fact]
    public void RemoveAsync_ShouldNotTrace_IfDisabled()
    {
        inner.Setup(i => i.RemoveAsync("kk", ct)).Returns(testTask);
        trace = null;

        var task = target.RemoveAsync("kk", ct); // Act

        task.Should().BeSameAs(testTask);
    }
}
