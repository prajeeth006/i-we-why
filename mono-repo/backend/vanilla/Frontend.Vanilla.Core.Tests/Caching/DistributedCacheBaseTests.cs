using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Caching;

public class DistributedCacheBaseTests
{
    private IDistributedCache target;
    private Mock<DistributedCacheBase> underlyingCache;

    private CancellationToken ct;
    private byte[] testBytes;
    private DistributedCacheEntryOptions options;

    public DistributedCacheBaseTests()
    {
        underlyingCache = new Mock<DistributedCacheBase>();
        target = underlyingCache.Object;

        ct = TestCancellationToken.Get();
        testBytes = "I find your lack of faith disturbing.".EncodeToBytes();
        options = new DistributedCacheEntryOptions();
    }

    [Fact]
    public void Get_ShouldAddExecutionMode()
    {
        underlyingCache.SetupWithAnyArgs(c => c.GetAsync(default, null)).ReturnsAsync(testBytes);

        var result = target.Get("key"); // Act

        result.Should().BeSameAs(testBytes);
        underlyingCache.Verify(c => c.GetAsync(ExecutionMode.Sync, "key"));
    }

    [Fact]
    public async Task GetAsync_ShouldAddExecutionMode()
    {
        underlyingCache.SetupWithAnyArgs(c => c.GetAsync(default, null)).ReturnsAsync(testBytes);

        var result = await target.GetAsync("key", ct); // Act

        result.Should().BeSameAs(testBytes);
        underlyingCache.Verify(c => c.GetAsync(ExecutionMode.Async(ct), "key"));
    }

    [Fact]
    public void Set_ShouldAddExecutionMode()
    {
        target.Set("key", testBytes, options); // Act
        underlyingCache.Verify(c => c.SetAsync(ExecutionMode.Sync, "key", testBytes, options));
    }

    [Fact]
    public async Task SetAsync_ShouldAddExecutionMode()
    {
        await target.SetAsync("key", testBytes, options, ct); // Act
        underlyingCache.Verify(c => c.SetAsync(ExecutionMode.Async(ct), "key", testBytes, options));
    }

    [Fact]
    public void Remove_ShouldAddExecutionMode()
    {
        target.Remove("key"); // Act
        underlyingCache.Verify(c => c.RemoveAsync(ExecutionMode.Sync, "key"));
    }

    [Fact]
    public async Task RemoveAsync_ShouldAddExecutionMode()
    {
        await target.RemoveAsync("key", ct); // Act
        underlyingCache.Verify(c => c.RemoveAsync(ExecutionMode.Async(ct), "key"));
    }

    [Fact]
    public void Refresh_ShouldAddExecutionMode()
    {
        target.Refresh("key"); // Act
        underlyingCache.Verify(c => c.RefreshAsync(ExecutionMode.Sync, "key"));
    }

    [Fact]
    public async Task RefreshAsync_ShouldAddExecutionMode()
    {
        await target.RefreshAsync("key", ct); // Act
        underlyingCache.Verify(c => c.RefreshAsync(ExecutionMode.Async(ct), "key"));
    }
}
