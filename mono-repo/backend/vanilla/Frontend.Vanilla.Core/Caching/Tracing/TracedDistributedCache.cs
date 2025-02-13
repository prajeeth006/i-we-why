using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Microsoft.Extensions.Caching.Distributed;

namespace Frontend.Vanilla.Core.Caching.Tracing;

/// <summary>
/// Records all details of distributed cache operation for tracing purposes.
/// </summary>
internal sealed class TracedDistributedCache(IDistributedCache inner, ITraceRecorder traceRecorder)
    : DistributedCacheBase
{
    public override Task<byte[]?> GetAsync(ExecutionMode mode, string key)
    {
        var trace = traceRecorder.GetRecordingTrace();

        return trace != null
            ? GetWithTracingAsync(mode, key, trace)
            : inner.GetAsync(mode, key);
    }

    private async Task<byte[]?> GetWithTracingAsync(ExecutionMode mode, string key, IRecordingTrace trace)
    {
        var value = await inner.GetAsync(mode, key);

        trace.Record(GetMessage("read", key),
            ("cacheEntry.key", key),
            ("cacheEntry.value", value?.DecodeToString()),
            ("executionMode", mode.ToString()));

        return value;
    }

    public override Task SetAsync(ExecutionMode mode, string key, byte[] value, DistributedCacheEntryOptions options)
    {
        var trace = traceRecorder.GetRecordingTrace();

        return trace != null
            ? SetWithTracingAsync(mode, key, value, options, trace)
            : inner.SetAsync(mode, key, value, options);
    }

    private async Task SetWithTracingAsync(ExecutionMode mode, string key, byte[] value, DistributedCacheEntryOptions options, IRecordingTrace trace)
    {
        await inner.SetAsync(mode, key, value, options);

        trace.Record(GetMessage("write", key),
            ("cacheEntry.key", key),
            ("cacheEntry.value", value.DecodeToString()),
            ("options.absoluteExpiration", options.AbsoluteExpiration?.UtcDateTime),
            ("options.absoluteExpirationRelativeToNow", options.AbsoluteExpirationRelativeToNow),
            ("options.slidingExpiration", options.SlidingExpiration),
            ("executionMode", mode.ToString()));
    }

    public override Task RefreshAsync(ExecutionMode mode, string key)
    {
        var trace = traceRecorder.GetRecordingTrace();

        return trace != null
            ? RefreshWithTracingAsync(mode, key, trace)
            : inner.RefreshAsync(mode, key);
    }

    private async Task RefreshWithTracingAsync(ExecutionMode mode, string key, IRecordingTrace trace)
    {
        await inner.RefreshAsync(mode, key);

        trace.Record(GetMessage("refresh", key),
            ("cacheEntry.key", key),
            ("executionMode", mode.ToString()));
    }

    public override Task RemoveAsync(ExecutionMode mode, string key)
    {
        var trace = traceRecorder.GetRecordingTrace();

        return trace != null
            ? RemoveWithTracingAsync(mode, key, trace)
            : inner.RemoveAsync(mode, key);
    }

    private async Task RemoveWithTracingAsync(ExecutionMode mode, string key, IRecordingTrace trace)
    {
        await inner.RemoveAsync(mode, key);

        trace.Record(GetMessage("removal", key),
            ("cacheEntry.key", key),
            ("executionMode", mode.ToString()));
    }

    private static string GetMessage(string operation, string key)
        => $"{nameof(IDistributedCache).Substring(1)} {operation}: {key}";
}
