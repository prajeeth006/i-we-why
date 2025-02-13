using System;
using System.Collections.Generic;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Core.Caching;

/// <summary>
/// Base class for easy extension of standard cache entry returned by <see cref="IMemoryCache.CreateEntry" />.
/// </summary>
internal abstract class MemoryCacheEntryDecorator(ICacheEntry inner) : ICacheEntry
{
    public ICacheEntry Inner { get; } = inner;

    public virtual object Key => Inner.Key;

    public object? Value
    {
        get => Inner.Value;
        set => Inner.Value = value;
    }

    public DateTimeOffset? AbsoluteExpiration
    {
        get => Inner.AbsoluteExpiration;
        set => Inner.AbsoluteExpiration = value;
    }

    public TimeSpan? AbsoluteExpirationRelativeToNow
    {
        get => Inner.AbsoluteExpirationRelativeToNow;
        set => Inner.AbsoluteExpirationRelativeToNow = value;
    }

    public TimeSpan? SlidingExpiration
    {
        get => Inner.SlidingExpiration;
        set => Inner.SlidingExpiration = value;
    }

    public CacheItemPriority Priority
    {
        get => Inner.Priority;
        set => Inner.Priority = value;
    }

    public long? Size
    {
        get => Inner.Size;
        set => Inner.Size = value;
    }

    public IList<IChangeToken> ExpirationTokens => Inner.ExpirationTokens;
    public IList<PostEvictionCallbackRegistration> PostEvictionCallbacks => Inner.PostEvictionCallbacks;
    public virtual void Dispose() => Inner.Dispose();
}
