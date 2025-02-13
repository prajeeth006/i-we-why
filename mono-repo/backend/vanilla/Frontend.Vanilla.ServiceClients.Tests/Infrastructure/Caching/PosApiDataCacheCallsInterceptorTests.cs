using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Caching;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Caching;

public class PosApiDataCacheCallsInterceptorTests
{
    private PosApiDataCacheBase target;
    private Mock<IPosApiDataCache> inner;
    private InterceptedCacheCalls interceptedCacheCalls;

    private ExecutionMode mode;
    private TimeSpan expiration;

    public PosApiDataCacheCallsInterceptorTests()
    {
        inner = new Mock<IPosApiDataCache>();
        interceptedCacheCalls = new InterceptedCacheCalls();
        target = new PosApiDataCacheCallsInterceptor(inner.Object, interceptedCacheCalls);

        mode = TestExecutionMode.Get();
        expiration = TimeSpan.FromSeconds(RandomGenerator.GetInt32());
    }

    public static IEnumerable<object[]> TestCases => TestValues.Booleans.ToTestCases()
        .CombineWith(PosApiDataType.Static, PosApiDataType.User);

    [Theory, MemberData(nameof(TestCases))]
    public async Task GetAsync_ShouldIntercept(bool isCacheHit, PosApiDataType dataType)
    {
        var innerResult = isCacheHit ? new Wrapper<string>("wtf") : null;
        inner.Setup(i => i.GetAsync<string>(mode, dataType, "kkk")).ReturnsAsync(innerResult);

        // Act
        var result = await target.GetAsync<string>(mode, dataType, "kkk");

        result.Should().BeSameAs(innerResult);
        interceptedCacheCalls.Should().Equal((dataType, "kkk", typeof(string)));
    }

    [Theory, EnumData(typeof(PosApiDataType))]
    public async Task SetAsync_ShouldNotIntercept(PosApiDataType dataType)
    {
        // Act
        await target.SetAsync(mode, dataType, "kkk", "val", expiration);

        inner.Verify(i => i.SetAsync(mode, dataType, "kkk", "val", expiration));
        interceptedCacheCalls.Should().BeEmpty();
    }

    [Theory, EnumData(typeof(PosApiDataType))]
    public async Task RemoveAsync_ShouldNotIntercept(PosApiDataType dataType)
    {
        // Act
        await target.RemoveAsync(mode, dataType, "kkk");

        inner.Verify(i => i.RemoveAsync(mode, dataType, "kkk"));
        interceptedCacheCalls.Should().BeEmpty();
    }

    [Theory, MemberData(nameof(TestCases))]
    public async Task GetOrCreateAsync_ShouldIntercept(bool cached, PosApiDataType dataType)
    {
        var factory = new Mock<Func<Task<string>>>();
        inner.Setup(i => i.GetOrCreateAsync(mode, dataType, "kkk", factory.Object, cached, expiration)).ReturnsAsync("val");

        // Act
        var result = await target.GetOrCreateAsync(mode, dataType, "kkk", factory.Object, cached, expiration);

        result.Should().Be("val");
        interceptedCacheCalls.Should().Equal((dataType, "kkk", typeof(string)));
        factory.Verify(f => f(), Times.Never);
    }
}
