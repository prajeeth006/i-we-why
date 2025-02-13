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

public class PosApiDataCacheIsolationTests
{
    private readonly Mock<IPosApiDataCache> inner = new ();

    private readonly ServiceClientsConfigurationBuilder config = new ()
    {
        AccessId = "4yx569",
        Headers =
        {
            ["X-Bwin-Channel"] = new[] { "IW", "AW" },
            ["x-aaa"] = Array.Empty<string>(),
        },
    };

    private readonly IFoo foo = Mock.Of<IFoo>();
    private readonly ExecutionMode mode = TestExecutionMode.Get();
    private readonly string cacheKey = "key[x-aaa=][x-bwin-channel=AW][x-bwin-channel=IW]";
    private readonly TimeSpan expiration = TimeSpan.FromSeconds(666);

    // Must be public for xUnit
    public interface IFoo { }

    private PosApiDataCacheIsolation GetTarget()
        => new (inner.Object, config.Build());

    public static IEnumerable<object[]> TestCases => TestValues.Booleans.ToTestCases()
        .CombineWith(PosApiDataType.Static, PosApiDataType.User);

    [Theory, MemberData(nameof(TestCases))]
    public async Task GetAsync_ShouldDelegate(bool isCacheHit, PosApiDataType dataType)
    {
        var innerResult = isCacheHit ? new Wrapper<IFoo>(foo) : null;
        inner.Setup(c => c.GetAsync<IFoo>(mode, dataType, cacheKey)).ReturnsAsync(innerResult);

        // Act
        var result = await GetTarget().GetAsync<IFoo>(mode, dataType, "key");

        result.Should().BeSameAs(innerResult);
    }

    [Theory, EnumData(typeof(PosApiDataType))]
    public async Task SetAsync_ShouldDelegate(PosApiDataType dataType)
    {
        // Act
        await GetTarget().SetAsync(mode, dataType, "key", foo, expiration);

        inner.Verify(c => c.SetAsync(mode, dataType, cacheKey, foo, expiration));
    }

    [Theory, EnumData(typeof(PosApiDataType))]
    public async Task RemoveAsync_ShouldDelegate(PosApiDataType dataType)
    {
        // Act
        await GetTarget().RemoveAsync(mode, dataType, "key");

        inner.Verify(c => c.RemoveAsync(mode, dataType, cacheKey));
    }

    [Theory, MemberData(nameof(TestCases))]
    public async Task GetOrCreateAsync_ShouldDelegate(bool cached, PosApiDataType dataType)
    {
        var factory = Mock.Of<Func<Task<IFoo>>>();
        inner.Setup(c => c.GetOrCreateAsync(mode, dataType, cacheKey, factory, cached, expiration)).ReturnsAsync(foo);

        // Act
        var value = await GetTarget().GetOrCreateAsync(mode, dataType, "key", factory, cached, expiration);

        value.Should().BeSameAs(foo);
        inner.Verify(c => c.GetOrCreateAsync(mode, dataType, cacheKey, factory, cached, expiration));
    }
}
