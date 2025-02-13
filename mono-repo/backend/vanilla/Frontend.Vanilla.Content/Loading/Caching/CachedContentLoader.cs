using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Core.Time.Background;
using JetBrains.Annotations;
using Microsoft.Extensions.Caching.Memory;

namespace Frontend.Vanilla.Content.Loading.Caching;

/// <summary>
/// Returns processors to be executed just-in-time.
/// </summary>
internal interface ICachedContentLoader
{
    [NotNull, ItemNotNull]
    Task<CachedContent> GetContentsAsync(ExecutionMode mode, [NotNull] ContentRequest request, [CanBeNull] Action<object> trace);
}

/// <summary>
/// Adds caching of content items to <see cref="IContentLoader" />.
/// Items are cached globally so all user-specific logic (e.g. filtering) should be applied afterwards.
/// </summary>
internal sealed class CachedContentLoader(
    IPreCachingContentLoader preCachingLoader,
    IMemoryCache memoryCache,
    IContentRequestFactory requestFactory,
    IBackgroundWorker backgroundWorker,
    ICurrentContextAccessor currentContextAccessor,
    IClock clock)
    : ICachedContentLoader
{
    private readonly Random random = new ();

    public async Task<CachedContent> GetContentsAsync(ExecutionMode mode, ContentRequest request, Action<object> trace)
    {
        if (!request.UseCache)
        {
            var fresh = await preCachingLoader.GetContentsAsync(mode, request, trace);
            // Makes sure prefetched content retrieved internally in case BypassChildrenCache was passed as true is returned as part of the response.
            fresh.Requested.PrefetchedContent = fresh.Prefetched;

            return fresh.Requested;
        }

        // If nothing cached -> need request for real -> lock to initiate only one
        var requestedCacheKey = GetCacheKey(request);

        if (!memoryCache.TryGetValue(requestedCacheKey, out CacheEntry cached))
        {
            // Use semaphores to allow only one retrieval (mostly HTTP request) for particular content at time,
            // first call makes the request, subsequent calls wait and will get cached content.
            // Because lock() isn't async so we use semaphores.
            // Store semaphores in cache -> they expire -> avoids memory leak if keys don't ever reoccur b/c of their uniqueness e.g. frequently changed marketing content
            var semaphore = memoryCache.GetOrCreate("Lock:" + requestedCacheKey, factoryLock: this, factory: e =>
            {
                e.SlidingExpiration = TimeSpan.FromMinutes(1);

                return new ExecutionModeSemaphore();
            });

            using (await semaphore.WaitDisposableAsync(mode, currentContextAccessor.Items))
                if (!memoryCache.TryGetValue(requestedCacheKey, out cached)) // Double-checked locking
                    return await GetFreshContentAndCacheItAsync(mode, request, trace);
        }

        // If cached but internally expired -> return expired asap and update on background
        if (cached.AbsoluteExpiration <= clock.UtcNow && !cached.IsUpdating)
            lock (cached)
                if (cached.AbsoluteExpiration <= clock.UtcNow && !cached.IsUpdating)
                {
                    IEnumerable<CacheEntry> entries = GetWithDependenciesFromCache(cached).ToList();
                    entries.Each(e => e.IsUpdating = true); // Also mark dependencies (e.g. child menu items) to avoid separate requests
                    backgroundWorker?.Run(UpdateContentOnBackgroundAsync, (request, entries));
                }

        return cached.Result;
    }

    public async Task UpdateContentOnBackgroundAsync((ContentRequest Request, IEnumerable<CacheEntry> UpdatedEntries) args)
    {
        await GetFreshContentAndCacheItAsync(ExecutionMode.Async(default), args.Request, trace: null);
        args.UpdatedEntries.Each(e =>
            e.IsUpdating = false); // Revert b/c there can be entries which weren't overwritten e.g. deleted content -> will get updated separately if needed or expire
    }

    private async Task<CachedContent> GetFreshContentAndCacheItAsync(ExecutionMode mode, ContentRequest request, Action<object> trace)
    {
        var results = await preCachingLoader.GetContentsAsync(mode, request, trace);

        if (results.RelativeExpiration <= TimeSpan.Zero)
            return results.Requested;

        // Calculate upfront -> same expiration for items prefetched together
        var internalAbsExpiration =
            clock.UtcNow + results.RelativeExpiration + TimeSpan.FromSeconds(10 * random.NextDouble()); // Randomize to get more uniform traffic on Sitecore side
        var realAbsExpiration = internalAbsExpiration + results.RelativeExpiration; // 2-times longer, arbitrary decision
        var dependentCacheKeys = new List<object>(results.Prefetched.Count);

        if (request.BypassChildrenCache)
        {
            results.Requested.PrefetchedContent = results.Prefetched;
        }
        else
        {
            foreach (var prefetched in results.Prefetched)
            {
                var prefetchedCacheKey = GetCacheKey(requestFactory.Create(prefetched.Content.Id));
                memoryCache.Set(prefetchedCacheKey, new CacheEntry(prefetched, internalAbsExpiration), realAbsExpiration.Value);
                dependentCacheKeys.Add(prefetchedCacheKey);
            }
        }

        memoryCache.Set(GetCacheKey(request), new CacheEntry(results.Requested, internalAbsExpiration, dependentCacheKeys), realAbsExpiration.Value);

        return results.Requested;
    }

    private IEnumerable<CacheEntry> GetWithDependenciesFromCache(CacheEntry entry)
        => entry.DependentCacheKeys
            .ConvertAll(memoryCache.Get<CacheEntry>)
            .Where(e => e != null)
            .Append(entry);

    private static string GetCacheKey(ContentRequest request) => request.ItemUrl.ToString();

    public sealed class CacheEntry(CachedContent result, UtcDateTime absoluteExpiration, IReadOnlyList<object> dependentCacheKeys = null)
    {
        public bool IsUpdating { get; set; }
        public CachedContent Result { get; } = result;
        public UtcDateTime AbsoluteExpiration { get; } = absoluteExpiration;
        public IReadOnlyList<object> DependentCacheKeys { get; } = dependentCacheKeys.NullToEmpty();
    }
}
