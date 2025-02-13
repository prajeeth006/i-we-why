using System.Collections.Generic;
using Frontend.Vanilla.Core.Caching.Isolation;
using Microsoft.Extensions.Caching.Memory;

namespace Frontend.Vanilla.Testing.Fakes;

/// <summary>
///     Stores info about created entries so that we can easily unit test their expiration and other details.
///     Uses real <see cref="MemoryCache" /> underneath.
/// </summary>
public sealed class TestMemoryCache : ILabelIsolatedMemoryCache
{
    private readonly MemoryCache inner;

#pragma warning disable 1591
    public TestMemoryCache(TestClock clock = null)
    {
        Clock = clock ?? new TestClock();
        inner = new MemoryCache(new MemoryCacheOptions { Clock = Clock });
    }

    public TestClock Clock { get; }

    public IList<ICacheEntry> CreatedEntries { get; } = new List<ICacheEntry>();
    public int Count => inner.Count;

    public ICacheEntry CreateEntry(object key)
    {
        var entry = inner.CreateEntry(key);
        CreatedEntries.Add(entry);

        return entry;
    }

    public bool TryGetValue(object key, out object value)
    {
        return inner.TryGetValue(key, out value);
    }

    public void Remove(object key)
    {
        inner.Remove(key);
    }

    public void Dispose()
    {
        inner.Dispose();
    }

    public void Clear()
    {
        inner.Compact(100);
    }
#pragma warning restore 1591
}
