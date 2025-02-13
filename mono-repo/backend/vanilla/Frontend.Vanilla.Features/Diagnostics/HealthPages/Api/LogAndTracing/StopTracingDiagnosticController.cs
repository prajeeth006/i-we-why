using System.Net.Http;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Diagnostics.Contracts;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.LogAndTracing;

internal sealed class StopTracingDiagnosticController(ITraceRecorder traceRecorder) : SyncDiagnosticApiController
{
    public override DiagnosticsRoute GetRoute()
        => new (HttpMethod.Delete, DiagnosticApiUrls.LogAndTracing.Tracing);

    public override object? Execute(HttpContext httpContext)
    {
        traceRecorder.StopRecording();

        return "Tracing stopped";
    }
}
