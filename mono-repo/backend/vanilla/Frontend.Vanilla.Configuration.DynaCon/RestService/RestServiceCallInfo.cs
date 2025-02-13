using System;
using System.Net.Http;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Configuration.DynaCon.RestService;

/// <summary>
/// Info about the call made to DynaCon REST service.
/// </summary>
internal sealed class RestServiceCallInfo(
    HttpUri url,
    HttpMethod method,
    UtcDateTime time,
    TimeSpan duration,
    string? requestContent,
    string? responseContent,
    Exception? error)
    : IHistoryItem
{
    public HttpUri Url { get; } = url;
    public HttpMethod Method { get; } = method;
    public UtcDateTime Time { get; } = time;
    public TimeSpan Duration { get; } = Guard.GreaterOrEqual(duration, TimeSpan.Zero, nameof(duration));
    public string? RequestContent { get; } = requestContent;
    public string? ResponseContent { get; } = responseContent;
    public Exception? Error { get; } = error;
    public bool Passed => Error == null; // Renders as red in /health/config
}
