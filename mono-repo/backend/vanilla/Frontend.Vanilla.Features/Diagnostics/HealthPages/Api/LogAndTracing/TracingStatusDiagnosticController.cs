using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.LogAndTracing;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Diagnostics.Tracing;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.LogAndTracing;

internal sealed class TracingStatusDiagnosticController(ITracingIdsProvider tracingIdsProvider, ICookieHandler cookieHandler, ILogPageConfiguration config)
    : SyncDiagnosticApiController, IDiagnosticApiController
{
    public override DiagnosticsRoute GetRoute() => DiagnosticApiUrls.LogAndTracing.Tracing;

    public override object? Execute(HttpContext httpContext)
    {
        var ids = tracingIdsProvider.GetTracingIds();
        var recordingExpiration = cookieHandler.GetValue(WebTraceRecorder.RecordingCookieName);
        var kibanaUrl = config.KibanaCorrelationSearchUrlTemplate.Replace(LogPageConfiguration.CorrelationIdPlaceholder, ids.CorrelationId);

        return new TracingStatusDto(ids.CorrelationId, recordingExpiration, kibanaUrl);
    }
}
