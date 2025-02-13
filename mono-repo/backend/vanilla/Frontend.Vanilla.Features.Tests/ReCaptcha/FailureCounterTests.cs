using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.ReCaptcha;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Caching.Distributed;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ReCaptcha;

public sealed class FailureCounterTests
{
    private readonly IFailureCounter target;
    private readonly ReCaptchaConfiguration config;
    private readonly Mock<IClientIPResolver> clientIpResolver;
    private readonly Mock<ILabelIsolatedDistributedCache> distributedCache;
    private readonly CancellationToken ct;

    public FailureCounterTests()
    {
        config = new ReCaptchaConfiguration();
        clientIpResolver = new Mock<IClientIPResolver>();
        distributedCache = new Mock<ILabelIsolatedDistributedCache>();
        ct = TestCancellationToken.Get();
        target = new FailureCounter(config, clientIpResolver.Object, distributedCache.Object);

        config.FailureCountExpiration = new TimeSpan(666);
        clientIpResolver.Setup(r => r.Resolve()).Returns(IPAddress.Parse("1.2.3.4"));
    }

    [Theory]
    [InlineData(null, false)]
    [InlineData("1", false)]
    [InlineData("2", false)]
    [InlineData("3", true)]
    [InlineData("5", true)]
    public async Task HasFailedAsync_ShouldReturnTrueIfGreaterOrEqualToFailedCount(string cachedValue, bool expected)
    {
        distributedCache.SetupWithAnyArgs(c => c.GetAsync(null, TestContext.Current.CancellationToken)).ReturnsAsync(cachedValue?.EncodeToBytes());
        config.FailureCount = 3;

        // Act
        var result = await target.HasFailedAsync("Login", ct);

        result.Should().Be(expected);
        distributedCache.Verify(c => c.GetAsync("Van:ReCaptcha:login:1.2.3.4", ct));
    }

    [Fact]
    public Task ReportSuccessAsync_ShouldDoNothing()
        => target.ReportSucessAsync("Whatever", ct);

    [Theory]
    [InlineData(null, "1")]
    [InlineData("0", "1")]
    [InlineData("1", "2")]
    [InlineData("52", "53")]
    public async Task ReportFailureAsync_ShouldIncrementValue(string cachedValue, string expected)
    {
        distributedCache.SetupWithAnyArgs(c => c.GetAsync(null, TestContext.Current.CancellationToken)).ReturnsAsync(cachedValue?.EncodeToBytes());

        // Act
        await target.ReportFailureAsync("Login", ct); // Act

        var expectedBytes = expected.EncodeToBytes();
        distributedCache.Verify(c => c.GetAsync("Van:ReCaptcha:login:1.2.3.4", ct));
        distributedCache.Verify(c => c.SetAsync("Van:ReCaptcha:login:1.2.3.4",
            expectedBytes,
            It.Is<DistributedCacheEntryOptions>(o => o.AbsoluteExpirationRelativeToNow == new TimeSpan(666)),
            ct));
    }

    [Fact]
    public async Task ClearAsync_ShouldRemoveCountFromCache()
    {
        await target.ClearAsync("Login", ct); // Act
        distributedCache.Verify(c => c.RemoveAsync("Van:ReCaptcha:login:1.2.3.4", ct));
    }
}
