using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure.Caching;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Caching;

public class StaticDataCacheTests
{
    private IStaticDataCache target;
    private TestMemoryCache memoryCache;
    private Mock<ILabelIsolatedDistributedCache> distributedCache;
    private TestClock clock;
    private ExecutionMode mode;

    public StaticDataCacheTests()
    {
        clock = new TestClock();
        memoryCache = new TestMemoryCache(clock);
        distributedCache = new Mock<ILabelIsolatedDistributedCache>();
        target = new StaticDataCache(memoryCache, distributedCache.Object, clock);

        mode = TestExecutionMode.Get();
        clock.UtcNow = new UtcDateTime(2017, 9, 20, 10, 15, 6);
        distributedCache.SetReturnsDefault(Task.FromResult<byte[]>(null));
    }

    [Fact]
    public async Task GetAsync_ShouldReturnNull_IfNothingCached()
    {
        // Act
        var result = await target.GetAsync(mode, "kk", typeof(string));

        result.Should().BeNull();
        distributedCache.Verify(c => c.GetAsync("Van:PosApi:StaticData:kk", mode.AsyncCancellationToken.Value));
    }

    public static readonly IEnumerable<object[]> DataTestCases = new[]
    {
        new object[] { "Long weekend", @"""Long weekend""" },
        new object[] { 123, "123" },
        new object[] { new Foo { Name = "James Bond" }, @"{ ""Name"": ""James Bond"" }" },
    };

    [Theory, MemberData(nameof(DataTestCases))]
    public async Task GetAsync_ShouldReturnCachedValue_FromDistributedCache<T>(T value, string valueJson)
    {
        distributedCache.Setup(c => c.GetAsync("Van:PosApi:StaticData:kk", mode.AsyncCancellationToken.Value)).ReturnsAsync((@"{
                ""AbsoluteExpiration"": ""2017-09-20T11:16:12Z"",
                ""CachedValue"": " + valueJson + @"
            }").EncodeToBytes());

        // Act
        var result = await target.GetAsync(mode, "kk", typeof(T));

        result.Should().BeEquivalentTo(value);

        var memoryEntry = memoryCache.CreatedEntries.Single();
        memoryEntry.Value.Should().BeSameAs(result);
        memoryEntry.AbsoluteExpiration.Value.Should().BeOnOrAfter(new DateTime(2017, 9, 20, 11, 16, 12, DateTimeKind.Utc))
            .And.BeBefore(new DateTime(2017, 9, 20, 11, 16, 22, DateTimeKind.Utc));
    }

    [Fact]
    public async Task GetAsync_ShouldReturnCachedValue_FromMemoryCache()
    {
        distributedCache.Setup(c => c.GetAsync("Van:PosApi:StaticData:kk", mode.AsyncCancellationToken.Value)).ReturnsAsync(@"{
                ""AbsoluteExpiration"": ""2017-09-20T11:16:12Z"",
                ""CachedValue"": ""bwin""
            }".EncodeToBytes());
        await target.GetAsync(mode, "kk", typeof(string)); // Populate memory cache
        distributedCache.Invocations.Clear();

        // Act
        var result = await target.GetAsync(mode, "kk", typeof(string));

        result.Should().Be("bwin");
        distributedCache.VerifyWithAnyArgs(c => c.GetAsync(null, TestContext.Current.CancellationToken), Times.Never);
    }

    [Fact]
    public async Task GetAsync_ShouldReturnNull_IfExpired()
    {
        distributedCache.SetupWithAnyArgs(c => c.GetAsync(null, TestContext.Current.CancellationToken)).ReturnsAsync(@$"{{
                ""AbsoluteExpiration"": ""2017-09-20T09:16:12Z"",
                ""CachedValue"": ""Hello""
            }}".EncodeToBytes());

        // Act
        var result = await target.GetAsync(mode, "kk", typeof(string));

        result.Should().BeNull();
        memoryCache.CreatedEntries.Should().BeEmpty();
    }

    [Theory, MemberData(nameof(DataTestCases))]
    public async Task SetAsync_ShouldSetValueToUnderlyingCache<T>(T value, string valueJson)
    {
        var expiration = TimeSpan.FromSeconds(66);

        // Act
        await target.SetAsync(mode, "kk", value, expiration);

        var memoryEntry = memoryCache.CreatedEntries.Single();
        memoryEntry.Value.Should().Be(value);
        memoryEntry.AbsoluteExpiration.Should().BeOnOrAfter(new DateTime(2017, 9, 20, 10, 16, 12, DateTimeKind.Utc))
            .And.BeBefore(new DateTime(2017, 9, 20, 10, 16, 22, DateTimeKind.Utc));

        distributedCache.Verify(x => x.SetAsync(
            "Van:PosApi:StaticData:kk",
            It.IsNotNull<byte[]>(),
            It.Is<DistributedCacheEntryOptions>(o => o.AbsoluteExpirationRelativeToNow == expiration),
            mode.AsyncCancellationToken.Value));
        ((byte[])distributedCache.Invocations.Single().Arguments[1]).DecodeToString().Should().BeJson(@"{
                ""AbsoluteExpiration"": ""2017-09-20T10:16:12Z"",
                ""CachedValue"": " + valueJson + @"
            }");
    }

    [Fact]
    public async Task RemoveAsync_ShouldRemoveFromUnderlyingCache()
    {
        memoryCache.Set("Van:PosApi:StaticData:kk", "existing");

        // Act
        await target.RemoveAsync(mode, "kk");

        distributedCache.Verify(x => x.RemoveAsync("Van:PosApi:StaticData:kk", mode.AsyncCancellationToken.Value));
        memoryCache.Count.Should().Be(0);
    }

    public class Foo
    {
        public string Name { get; set; }
    }
}
