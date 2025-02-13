using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;

namespace Frontend.Vanilla.Core.Caching;

internal static class DistributedCacheOperation
{
    public const string ReadHit = "read_hit";
    public const string ReadMiss = "read_miss";
    public const string ReadFail = "read_fail";
    public const string Write = "write";
    public const string WriteFail = "write_fail";
    public const string Delete = "delete";
    public const string DeleteFail = "delete_fail";
    public const string Refresh = "refresh";
    public const string RefreshFail = "refresh_fail";
}

internal static class DistributedCacheMetricRecorder
{
    public const string MetricName = "distributed_cache_duration_seconds";
    private static readonly Meter Meter = new (typeof(DistributedCacheMetricRecorder).Assembly.GetName().Name!);
    private static readonly Histogram<double> Metric = Meter.CreateHistogram<double>(MetricName, unit: "seconds", description: "Represents distributed cache operation duration in seconds.");
    public static readonly string MeterName = Meter.Name;

    private static readonly KeyValuePair<string, object?> ReadHitTag = new ("operation", DistributedCacheOperation.ReadHit);
    private static readonly KeyValuePair<string, object?> ReadMissTag = new ("operation", DistributedCacheOperation.ReadMiss);
    private static readonly KeyValuePair<string, object?> ReadFailTag = new ("operation", DistributedCacheOperation.ReadFail);
    private static readonly KeyValuePair<string, object?> WriteTag = new ("operation", DistributedCacheOperation.Write);
    private static readonly KeyValuePair<string, object?> WriteFailTag = new ("operation", DistributedCacheOperation.WriteFail);
    private static readonly KeyValuePair<string, object?> DeleteTag = new ("operation", DistributedCacheOperation.Delete);
    private static readonly KeyValuePair<string, object?> DeleteFailTag = new ("operation", DistributedCacheOperation.DeleteFail);
    private static readonly KeyValuePair<string, object?> RefreshTag = new ("operation", DistributedCacheOperation.Refresh);
    private static readonly KeyValuePair<string, object?> RefreshFailTag = new ("operation", DistributedCacheOperation.RefreshFail);

    public static void RecordSuccessWrite(TimeSpan duration)
    {
        Metric.Record(duration.TotalSeconds, tag: WriteTag);
    }

    public static void RecordFailedWrite(TimeSpan duration)
    {
        Metric.Record(duration.TotalSeconds, tag: WriteFailTag);
    }

    public static void RecordSuccessRead(TimeSpan duration, bool isCacheHit)
    {
        Metric.Record(duration.TotalSeconds, tag: isCacheHit ? ReadHitTag : ReadMissTag);
    }

    public static void RecordFailedRead(TimeSpan duration)
    {
        Metric.Record(duration.TotalSeconds, tag: ReadFailTag);
    }

    public static void RecordSuccessDelete(TimeSpan duration)
    {
        Metric.Record(duration.TotalSeconds, tag: DeleteTag);
    }

    public static void RecordFailedDelete(TimeSpan duration)
    {
        Metric.Record(duration.TotalSeconds, tag: DeleteFailTag);
    }

    public static void RecordSuccessRefresh(TimeSpan duration)
    {
        Metric.Record(duration.TotalSeconds, tag: RefreshTag);
    }

    public static void RecordFailedRefresh(TimeSpan duration)
    {
        Metric.Record(duration.TotalSeconds, tag: RefreshFailTag);
    }
}
