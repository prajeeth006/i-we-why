#nullable disable
using System;
using System.Threading;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.Tracing;

/// <summary>
/// Generates and provides tracing IDs according to Trace Context specification https://www.w3.org/TR/trace-context/.
/// </summary>
internal interface ITracingIdsProvider
{
    (string CorrelationId, string RequestId, bool IsRecording, string TraceParentHeader) GetTracingIds();
}

internal sealed class TracingIdsProvider(
    ITraceRecorder traceRecorder,
    ICurrentContextAccessor currentContextAccessor,
    ICookieHandler cookieHandler)
    : ITracingIdsProvider
{
    public const string CookieName = "trc.cid";

    public (string CorrelationId, string RequestId, bool IsRecording, string TraceParentHeader) GetTracingIds()
        => currentContextAccessor.Items.GetOrAddFromFactory("Van:TracingIds", _ => GetTraceDetails());

    private (string CorrelationId, string RequestId, bool IsRecording, string TraceParentHeader) GetTraceDetails()
    {
        var correlationId = ResolveCorrelationId();
        var requestId = GenerateRequestId();
        var isRecording = traceRecorder.GetRecordingTrace() != null;
        var flags = isRecording ? "01" : "00";
        var traceParentHeader = $"00-{correlationId}-{requestId}-{flags}";

        return (correlationId, requestId, isRecording, traceParentHeader);
    }

    private string ResolveCorrelationId()
    {
        if (!currentContextAccessor.Items.ContainsKey(CachedChangesetResolver.ItemsKey)) // Sacrifice first request when label config is loaded b/c we can't write the cookie below
            return GenerateCorrelationId();

        var id = cookieHandler.GetValue(CookieName);

        if (Guid.TryParseExact(id, CorrelationIdFormat, out _))
            return id;

        id = GenerateCorrelationId();
        cookieHandler.Set(CookieName, id, new CookieSetOptions()
        {
            MaxAge = TimeSpan.FromDays(365 * 5),
            HttpOnly = true,
        });

        return id;
    }

    private const string CorrelationIdFormat = "N";

    private static string GenerateCorrelationId()
        => Guid.NewGuid().ToString(CorrelationIdFormat);

    private static string GenerateRequestId()
    {
        var id = GetIncrementedRequestIdCounter();
        if (id == 0) id = GetIncrementedRequestIdCounter(); // All zeroes -> unsupported

        return id.ToString("X16");
    }

    private static long requestIdCounter;

    private static long GetIncrementedRequestIdCounter()
        => Interlocked.Add(ref requestIdCounter, 1);
}
