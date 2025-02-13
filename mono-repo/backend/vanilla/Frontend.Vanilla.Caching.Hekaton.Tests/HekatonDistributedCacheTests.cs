using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Caching.Hekaton.DataLayer;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Caching.Hekaton.Tests;

public class HekatonDistributedCacheTests
{
    private DistributedCacheBase target;
    private Mock<IHekatonDataLayer> dataLayer;
    private Mock<ICacheExpirationCalculator> expirationCalculator;

    private byte[] testBytes;
    private ExecutionMode mode;

    public HekatonDistributedCacheTests()
    {
        dataLayer = new Mock<IHekatonDataLayer>();
        expirationCalculator = new Mock<ICacheExpirationCalculator>();
        target = new HekatonDistributedCache(dataLayer.Object, expirationCalculator.Object);

        testBytes = Guid.NewGuid().ToByteArray();
        mode = TestExecutionMode.Get();
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task GetAsync_ShouldGetBytesUsingDataLayer(bool isCacheHit)
    {
        dataLayer.SetupWithAnyArgs(l => l.GetAsync(default, null)).ReturnsAsync(isCacheHit ? testBytes : null);

        var result = await target.GetAsync(mode, "key"); // Act

        result.Should().Equal(isCacheHit ? testBytes : null);
        dataLayer.Verify(l => l.GetAsync(mode, "key"));
    }

    [Fact]
    public async Task SetAsync_ShouldSetBytesUsingDataLayer()
    {
        var options = new DistributedCacheEntryOptions();
        var expiration = CacheExpiration.CreateAbsolute(default);
        expirationCalculator.Setup(c => c.Calculate(options, "key")).Returns(expiration);

        // Act
        await target.SetAsync(mode, "key", testBytes, options);

        dataLayer.Verify(l => l.SetAsync(mode, "key", testBytes, expiration));
    }

    [Fact]
    public async Task Remove_ShouldRemoveItemUsingDal()
    {
        await target.RemoveAsync(mode, "foo"); // Act

        dataLayer.Verify(l => l.RemoveAsync(mode, "foo"));
    }

    [Fact]
    public async Task Refresh_ShouldRemoveItemUsingDal()
    {
        await target.RefreshAsync(mode, "foo"); // Act

        dataLayer.Verify(l => l.RefreshAsync(mode, "foo"));
    }
}
