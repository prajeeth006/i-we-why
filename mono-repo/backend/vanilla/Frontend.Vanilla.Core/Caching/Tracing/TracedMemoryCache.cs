using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Caching.Tracing;

/// <summary>
/// Records all details of memory cache operation for tracing purposes.
/// </summary>
internal sealed class TracedMemoryCache(IMemoryCache inner, ITraceRecorder traceRecorder) : IMemoryCache
{
    public bool TryGetValue(object key, out object? value)
    {
        var trace = traceRecorder.GetRecordingTrace();
        var isCacheHit = inner.TryGetValue(key, out value);

        if (trace != null)
            Record(trace, "read", key, new[]
            {
                ("cacheEntry.value", Serialize(value)),
                ("isCacheHit", isCacheHit),
            });

        return isCacheHit;
    }

    public ICacheEntry CreateEntry(object key)
    {
        var trace = traceRecorder.GetRecordingTrace();
        var innerEntry = inner.CreateEntry(key);

        return trace != null
            ? new TracingCacheEntry(innerEntry, trace)
            : innerEntry;
    }

    private sealed class TracingCacheEntry(ICacheEntry inner, IRecordingTrace trace) : MemoryCacheEntryDecorator(inner)
    {
        public override void Dispose()
        {
            base.Dispose();

            Record(trace, "write", Key, new[]
            {
                ("cacheEntry.value", Serialize(Value)),
                ("cacheEntry.absoluteExpiration", AbsoluteExpiration?.UtcDateTime),
                ("cacheEntry.absoluteExpirationRelativeToNow", AbsoluteExpirationRelativeToNow),
                ("cacheEntry.slidingExpiration", SlidingExpiration),
            });
        }
    }

    public void Remove(object key)
    {
        var trace = traceRecorder.GetRecordingTrace();

        inner.Remove(key);

        if (trace != null)
            Record(trace, "removal", key);
    }

    private static void Record(IRecordingTrace trace, string operation, object key, IEnumerable<(string, object?)>? values = null)
        => trace.Record($"{nameof(MemoryCache)} {operation}: {Serialize(key)}", new Dictionary<string, object?>
        {
            ("cacheEntry.key", Serialize(key)),
            ("cacheEntry.keyType", key?.GetType().ToString() ?? "null"),
            values.NullToEmpty(),
        });

    private static object? Serialize(object? value)
    {
        try
        {
            return JsonConvert.SerializeObject(value);
        }
        catch (Exception ex)
        {
            return $"Failed to serialize {value?.GetType()}: {ex}";
        }
    }

    public void Dispose()
        => inner.Dispose();
}
