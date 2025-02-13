using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Caching.Isolation;

public class DistributedCacheIsolationTests
{
    private IsolatedDistributedCache target;
    private Mock<IDistributedCache> inner;
    private Mock<Func<string, string>> getIsolationPrefix;
    private byte[] testBytes;
    private DistributedCacheEntryOptions options;

    public DistributedCacheIsolationTests()
    {
        inner = new Mock<IDistributedCache>();
        getIsolationPrefix = new Mock<Func<string, string>>();
        target = new IsolatedDistributedCache(inner.Object, getIsolationPrefix.Object);
        testBytes = Guid.NewGuid().ToByteArray();
        options = new DistributedCacheEntryOptions();
        getIsolationPrefix.SetupWithAnyArgs(g => g(null)).Returns("prefix-");
    }

    [Fact]
    public void Constructor_ShouldSetProperties()
    {
        target.Inner.Should().BeSameAs(inner.Object);
        target.GetKeyPrefix.Should().BeSameAs(getIsolationPrefix.Object);
    }

    [Fact]
    public void IsolateBy_ShouldPassParameters()
    {
        target = (IsolatedDistributedCache)inner.Object.IsolateBy(getIsolationPrefix.Object); // Act
        Constructor_ShouldSetProperties();
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void IsolateBy_ShouldSupportStaticValue(bool inputWithDiagnostics)
    {
        // Act
        target = (IsolatedDistributedCache)(inputWithDiagnostics
            ? inner.Object.IsolateBy("static")
            : ((IDistributedCache)inner.Object).IsolateBy("static"));

        target.Inner.Should().BeSameAs(inner.Object);
        target.GetKeyPrefix("whatever").Should().Be("static");
    }

    [Fact]
    public async Task GetAsync_ShouldDelegateToActiveCache()
    {
        inner.SetupWithAnyArgs(c => c.GetAsync(null, TestContext.Current.CancellationToken)).ReturnsAsync(testBytes);

        var result = await target.GetAsync("key", TestContext.Current.CancellationToken); // Act

        result.Should().BeSameAs(testBytes);
        inner.Verify(c => c.GetAsync("prefix-key", TestContext.Current.CancellationToken));
        VerifyGetIsolationPrefix();
    }

    [Fact]
    public async Task SetAsync_ShouldDelegateToActiveCache()
    {
        await target.SetAsync("key", testBytes, options, TestContext.Current.CancellationToken); // Act

        inner.Verify(c => c.SetAsync("prefix-key", testBytes, options, TestContext.Current.CancellationToken));
        VerifyGetIsolationPrefix();
    }

    [Fact]
    public async Task RefreshAsync_ShouldDelegateToActiveCache()
    {
        await target.RefreshAsync("key", TestContext.Current.CancellationToken); // Act

        inner.Verify(c => c.RefreshAsync("prefix-key", TestContext.Current.CancellationToken));
        VerifyGetIsolationPrefix();
    }

    [Fact]
    public async Task RemoveAsync_ShouldDelegateToActiveCache()
    {
        await target.RemoveAsync("key", TestContext.Current.CancellationToken); // Act

        inner.Verify(c => c.RemoveAsync("prefix-key", TestContext.Current.CancellationToken));
        VerifyGetIsolationPrefix();
    }

    private void VerifyGetIsolationPrefix()
    {
        getIsolationPrefix.VerifyWithAnyArgs(g => g(null), Times.Once);
        getIsolationPrefix.Verify(g => g("key"));
    }
}
