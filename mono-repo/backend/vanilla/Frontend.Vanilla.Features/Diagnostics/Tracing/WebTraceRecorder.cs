using System;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Diagnostics.Tracing;

/// <summary>
/// Implementation of <see cref="ITraceRecorder" /> for Vanilla web apps.
/// </summary>
internal sealed class WebTraceRecorder(
    ILogger<WebTraceRecorder> log,
    IHttpContextAccessor httpContextAccessor,
    ICookieHandler cookieHandler,
    IInternalRequestEvaluator internalRequestEvaluator,
    IClock clock)
    : ITraceRecorder
{
    public const string RecordingCookieName = "trc.rec";
    private readonly ILogger log = log;

    public IRecordingTrace? GetRecordingTrace()
    {
        var httpContext = httpContextAccessor.HttpContext;

        if (httpContext == null
            || httpContext.Request.Path.StartsWithIgnoreCase("/health")
            || !httpContext.Items.ContainsKey(CachedChangesetResolver.ItemsKey) // No DynaCon config associated yet
            || cookieHandler.GetValue(RecordingCookieName) == null
            || !internalRequestEvaluator.IsInternal())
            return null;

        return new WebRecordingTrace(log);
    }

    public void StartRecording()
    {
        var relativeExpiration = TimeSpan.FromMinutes(5);
        var absoluteExpiration = clock.UtcNow + relativeExpiration;
        cookieHandler.Set(RecordingCookieName, absoluteExpiration.ToString(), new CookieSetOptions()
        {
            MaxAge = relativeExpiration,
            HttpOnly = true,
        });
    }

    public void StopRecording()
        => cookieHandler.Delete(RecordingCookieName);
}
