using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Core.Caching;

internal sealed class MetricsDistributedCache(IDistributedCache inner, ILogger<MetricsDistributedCache> log)
    : DistributedCacheBase
{
    public override async Task<byte[]?> GetAsync(ExecutionMode mode, string key)
    {
        var start = Stopwatch.GetTimestamp();
        try
        {
            var value = await inner.GetAsync(mode, key);
            DistributedCacheMetricRecorder.RecordSuccessRead(Stopwatch.GetElapsedTime(start), isCacheHit: value != null);
            return value;
        }
        catch (Exception ex)
        {
            DistributedCacheMetricRecorder.RecordFailedRead(Stopwatch.GetElapsedTime(start));
            Log(ex, key, operation: "get");
            return null;
        }
    }

    public override async Task SetAsync(ExecutionMode mode, string key, byte[] value, DistributedCacheEntryOptions options)
    {
        var start = Stopwatch.GetTimestamp();
        try
        {
            await inner.SetAsync(mode, key, value, options);
            DistributedCacheMetricRecorder.RecordSuccessWrite(Stopwatch.GetElapsedTime(start));
        }
        catch (Exception ex)
        {
            DistributedCacheMetricRecorder.RecordFailedWrite(Stopwatch.GetElapsedTime(start));
            Log(ex, key, "set");
        }
    }

    public override async Task RefreshAsync(ExecutionMode mode, string key)
    {
        var start = Stopwatch.GetTimestamp();
        try
        {
            await inner.RefreshAsync(mode, key);
            DistributedCacheMetricRecorder.RecordSuccessRefresh(Stopwatch.GetElapsedTime(start));
        }
        catch (Exception ex)
        {
            DistributedCacheMetricRecorder.RecordFailedRefresh(Stopwatch.GetElapsedTime(start));
            Log(ex, key, "refresh");
        }
    }

    public override async Task RemoveAsync(ExecutionMode mode, string key)
    {
        var start = Stopwatch.GetTimestamp();
        try
        {
            await inner.RemoveAsync(mode, key);
            DistributedCacheMetricRecorder.RecordSuccessDelete(Stopwatch.GetElapsedTime(start));
        }
        catch (Exception ex)
        {
            DistributedCacheMetricRecorder.RecordFailedDelete(Stopwatch.GetElapsedTime(start));
            Log(ex, key, "remove");
        }
    }

    public const string SqlConcurrencyDisclaimer = "This is concurrency error which happens sometimes as part of regular operation. Ask database team for more details.";

    public const string SqlErrorDisclaimer =
        "The error is related to the database itself so verify the configuration, examine the network connection or ask database team for support.";

    private void Log(Exception ex, string key, string operation)
    {
        var errorMsg = $"{DistributedCacheExtensions.Current} failed to {operation} the item with {key} (may include Vanilla app prefix).";

        switch (DistributedCacheExtensions.Current, ex)
        {
            case (DistributedCacheType.Hekaton, SqlException { Number: 41302 or 41305 or 41325 or 41301 }):
                log.LogWarning(ex, errorMsg + SqlConcurrencyDisclaimer, operation, key);
                break;

            case (DistributedCacheType.Hekaton, SqlException):
                log.LogError(ex, errorMsg + SqlErrorDisclaimer, operation, key);
                break;

            case (_, _):
                log.LogError(ex, errorMsg, operation, key);
                break;
        }
    }
}
