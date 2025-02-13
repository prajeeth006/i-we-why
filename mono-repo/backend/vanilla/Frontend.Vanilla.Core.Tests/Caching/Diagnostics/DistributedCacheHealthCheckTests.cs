using System;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching.Diagnostics;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Caching.Diagnostics;

public class DistributedCacheHealthCheckTests
{
    private IHealthCheck target;
    private Mock<ILabelIsolatedDistributedCache> dataLayer;
    private Mock<IConfiguration> config;

    public DistributedCacheHealthCheckTests()
    {
        dataLayer = new Mock<ILabelIsolatedDistributedCache>();
        config = new Mock<IConfiguration>().WithConnectionStrings();
        Environment.SetEnvironmentVariable("VANILLA_DISTRIBUTED_CACHE", "redis");
        target = new DistributedCacheHealthCheck(config.Object, dataLayer.Object);
    }

    private void DataLayerCalled(Func<Times> times)
    {
        dataLayer.VerifyWithAnyArgs(l => l.SetAsync(null, null, null, default), times);
        dataLayer.VerifyWithAnyArgs(l => l.GetAsync(null, default), times);
    }

    [Fact]
    public async Task ShallPass()
    {
        byte[] cachedValue = null;
        string cacheKey = null;
        dataLayer.SetupWithAnyArgs(d => d.SetAsync(null, null, null, TestContext.Current.CancellationToken))
            .Returns((string key, byte[] value, DistributedCacheEntryOptions expiration, CancellationToken ct) =>
            {
                cachedValue = value;
                cacheKey = key;

                return Task.CompletedTask;
            });
        dataLayer.SetupWithAnyArgs(d => d.GetAsync(null, TestContext.Current.CancellationToken)).ReturnsAsync(() => cachedValue);

        // Act
        var result = await target.ExecuteAsync(TestContext.Current.CancellationToken);

        result.Error.Should().BeNull();
        result.Details.Should().BeEquivalentTo(new { ConnectionString = "redis-connection-string" });
        cacheKey.Should().NotBeNullOrWhiteSpace();
        cachedValue.Should().NotBeNullOrEmpty();
        dataLayer.Verify(l =>
            l.SetAsync(cacheKey, cachedValue, It.Is<DistributedCacheEntryOptions>(e => e.AbsoluteExpirationRelativeToNow == TimeSpan.FromSeconds(10)), TestContext.Current.CancellationToken));
        dataLayer.Verify(l => l.GetAsync(cacheKey, TestContext.Current.CancellationToken));
        DataLayerCalled(Times.AtMostOnce);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task ShouldFail_IfDifferentValueRetrievedFromCache(bool returnNullBytes)
    {
        dataLayer.SetupWithAnyArgs(d => d.SetAsync(null, null, null, TestContext.Current.CancellationToken)).Returns(Task.CompletedTask);
        dataLayer.SetupWithAnyArgs(d => d.GetAsync(null, TestContext.Current.CancellationToken)).ReturnsAsync(returnNullBytes ? null : Guid.NewGuid().ToByteArray());

        var result = await target.ExecuteAsync(TestContext.Current.CancellationToken); // Act

        result.Error.Should().BeOfType<string>().Which.Should()
            .Match("Returned cached item value [" + (returnNullBytes ? "" : "0x") + "*] is not equal to original item's value [0x*].");
        DataLayerCalled(Times.AtMostOnce);
    }
}
