using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Loading.Caching;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time.Background;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.Caching;

public class CachedContentLoaderTestsWithTracing() : CachedContentLoaderTests(true) { }

public class CachedContentLoaderTestsWithoutTracing() : CachedContentLoaderTests(false) { }

public abstract class CachedContentLoaderTests : TraceTestsBase
{
    protected CachedContentLoaderTests(bool useTrace)
        : base(useTrace)
    {
        inner = new Mock<IPreCachingContentLoader>();
        clock = new TestClock();
        cache = new TestMemoryCache(clock);
        requestFactory = new Mock<IContentRequestFactory>();
        backgroundWorker = new Mock<IBackgroundWorker>();
        var appContextResolver = Mock.Of<ICurrentContextAccessor>(r => r.Items == new ConcurrentDictionary<object, Lazy<object>>());
        target = new CachedContentLoader(inner.Object, cache, requestFactory.Object, backgroundWorker.Object, appContextResolver, clock);

        mode = TestExecutionMode.Get();
        request = TestContentRequest.Get(url: "http://sitecore/requested");
        innerResults = new WithPrefetched<CachedContent>(
            TestContent.GetCached(id: "requested"),
            new[]
            {
                TestContent.GetCached(id: "prefetched1"),
                TestContent.GetCached(id: "prefetched2"),
            },
            TimeSpan.FromSeconds(60));

        inner.Setup(i => i.GetContentsAsync(mode, ItIs.SameAs(() => request), TraceFunc)).ReturnsAsync(() => innerResults);
        requestFactory.Setup(f => f.Create("prefetched1", 0, false, "", false, false)).Returns(TestContentRequest.Get(url: "http://sitecore/prefetched1"));
        requestFactory.Setup(f => f.Create("prefetched2", 0, false, "", false, false)).Returns(TestContentRequest.Get(url: "http://sitecore/prefetched2"));
    }

    private readonly CachedContentLoader target;
    private readonly Mock<IPreCachingContentLoader> inner;
    private readonly TestMemoryCache cache;
    private readonly Mock<IContentRequestFactory> requestFactory;
    private readonly Mock<IBackgroundWorker> backgroundWorker;
    private readonly TestClock clock;

    private readonly ExecutionMode mode;
    private ContentRequest request;
    private WithPrefetched<CachedContent> innerResults;

    private Task<CachedContent> TargetGetAsync()
        => target.GetContentsAsync(mode, request, TraceFunc);

    [Fact]
    public async Task GetContentsAsync_ShouldCacheContentWithAllPrefetched()
    {
        // Act
        var result = await TargetGetAsync();

        result.Should().BeSameAs(innerResults.Requested);
        cache.CreatedEntries.Should().HaveCount(4);
        cache.CreatedEntries[0].Key.Should().Be("Lock:http://sitecore/requested");
        cache.CreatedEntries[0].Value.Should().BeOfType<ExecutionModeSemaphore>();
        VerifyCached("http://sitecore/requested", innerResults.Requested, new[] { "http://sitecore/prefetched1", "http://sitecore/prefetched2" });
        VerifyCached("http://sitecore/prefetched1", innerResults.Prefetched[0]);
        VerifyCached("http://sitecore/prefetched2", innerResults.Prefetched[1]);
        backgroundWorker.VerifyWithAnyArgs(w => w.Run(null), Times.Never);
    }

    [Fact]
    public async Task GetContentsAsync_ShouldNotCachePrefetchedContentWhenSpecified()
    {
        request = TestContentRequest.Get(url: "http://sitecore/requested", bypassPrefetchedCache: true);
        // Act
        var result = await TargetGetAsync();

        result.Should().BeSameAs(innerResults.Requested);
        cache.CreatedEntries.Should().HaveCount(2);
        cache.CreatedEntries[0].Key.Should().Be("Lock:http://sitecore/requested");
        cache.CreatedEntries[0].Value.Should().BeOfType<ExecutionModeSemaphore>();
        VerifyCached("http://sitecore/requested", innerResults.Requested, null);
        cache.CreatedEntries.FirstOrDefault(e => e.Key.Equals("http://sitecore/prefetched1")).Should().BeNull();
        cache.CreatedEntries.FirstOrDefault(e => e.Key.Equals("http://sitecore/prefetched2")).Should().BeNull();
        backgroundWorker.VerifyWithAnyArgs(w => w.Run(null), Times.Never);
    }

    private void VerifyCached(string expectedKey, object expectedResult, IEnumerable<string> expectedDependentCacheKeys = null)
    {
        var entry = cache.CreatedEntries.Single(e => e.Key.Equals(expectedKey));
        entry.AbsoluteExpiration.Should().BeOnOrAfter(cache.Clock.UtcNow.AddSeconds(120).Value)
            .And.BeBefore(cache.Clock.UtcNow.AddSeconds(130).Value);
        var innerEntry = entry.Value.Should().BeAssignableTo<CachedContentLoader.CacheEntry>().Which;
        innerEntry.Result.Should().BeSameAs(expectedResult);
        innerEntry.IsUpdating.Should().BeFalse();
        innerEntry.AbsoluteExpiration.Value.Should().BeOnOrAfter(cache.Clock.UtcNow.AddSeconds(60).Value)
            .And.BeBefore(cache.Clock.UtcNow.AddSeconds(70).Value);
        innerEntry.DependentCacheKeys.Should().BeEquivalentTo(expectedDependentCacheKeys ?? Array.Empty<string>());
    }

    [Fact]
    public async Task GetContentsAsync_ShouldReturnCached_IfWithinExpiration()
    {
        await TargetGetAsync(); // Populate cache

        // Act
        var result = await TargetGetAsync();

        result.Should().BeSameAs(innerResults.Requested);
        inner.VerifyWithAnyArgs(i => i.GetContentsAsync(default, null, null), Times.Once);
        backgroundWorker.VerifyWithAnyArgs(w => w.Run(null), Times.Never);
    }

    [Fact]
    public async Task GetContentsAsync_ShouldTriggerBackgroundUpdate_AndServeStaleContent_IfInternallyExpired()
    {
        IBackgroundOperation backgroundOp = default;
        backgroundWorker.SetupWithAnyArgs(w => w.Run(null)).Callback<IBackgroundOperation>(op => backgroundOp = op);

        await TargetGetAsync(); // Populate cache
        cache.Clock.UtcNow += TimeSpan.FromSeconds(72); // CacheTime 60 + random 0-10

        // Act
        var result = await TargetGetAsync();

        result.Should().BeSameAs(innerResults.Requested);
        inner.VerifyWithAnyArgs(i => i.GetContentsAsync(default, null, null), Times.Once);

        var cacheEntries = cache.CreatedEntries.Skip(1).Select(e => e.Value).Cast<CachedContentLoader.CacheEntry>().ToList();
        cacheEntries.Each(e => e.IsUpdating.Should().BeTrue());

        var updateOp = (BackgroundOperation<(ContentRequest Request, IEnumerable<CachedContentLoader.CacheEntry> UpdatedEntries)>)backgroundOp;
        updateOp.Function.Should().Be(new Func<(ContentRequest, IEnumerable<CachedContentLoader.CacheEntry>), Task>(target.UpdateContentOnBackgroundAsync));
        updateOp.Arg.Request.Should().BeSameAs(request);
        updateOp.Arg.UpdatedEntries.Should().BeEquivalentTo(cacheEntries);
    }

    [Theory, ValuesData(-66, 0)]
    public async Task GetContentsAsync_ShouldNotCache_IfNotPositiveCacheTime(int cacheTimeSeconds)
    {
        innerResults = new WithPrefetched<CachedContent>(innerResults.Requested, innerResults.Prefetched, TimeSpan.FromSeconds(cacheTimeSeconds));
        await RunNoCachingTest(expectedCacheCount: 1); // 1 entry is a semaphore
    }

    [Fact]
    public async Task GetContentsAsync_ShouldPassInnerResults_IfCachingDisabled()
    {
        request = TestContentRequest.Get(useCache: false);
        await RunNoCachingTest();
    }

    private async Task RunNoCachingTest(int expectedCacheCount = 0)
    {
        // Act
        var result = await TargetGetAsync();

        result.Should().BeSameAs(innerResults.Requested);
        cache.CreatedEntries.Should().HaveCount(expectedCacheCount);
        backgroundWorker.VerifyWithAnyArgs(w => w.Run(null), Times.Never);
    }

    [Fact]
    public async Task UpdateContentOnBackgroundAsync_ShouldCacheContentWithAllPrefetched()
    {
        inner.Reset();
#pragma warning disable xUnit1051
        inner.Setup(i => i.GetContentsAsync(ExecutionMode.Async(default), request, null)).ReturnsAsync(innerResults);
#pragma warning restore xUnit1051
        var updatedEntries = new[]
        {
            new CachedContentLoader.CacheEntry(TestContent.GetCached(), clock.UtcNow) { IsUpdating = true },
            new CachedContentLoader.CacheEntry(TestContent.GetCached(), clock.UtcNow) { IsUpdating = true },
        };

        // Act
        await target.UpdateContentOnBackgroundAsync((request, updatedEntries));

        cache.CreatedEntries.Should().HaveCount(3);
        VerifyCached("http://sitecore/requested", innerResults.Requested, new[] { "http://sitecore/prefetched1", "http://sitecore/prefetched2" });
        VerifyCached("http://sitecore/prefetched1", innerResults.Prefetched[0]);
        VerifyCached("http://sitecore/prefetched2", innerResults.Prefetched[1]);
        updatedEntries.Each(e => e.IsUpdating.Should().BeFalse());
    }
}
