using System.Net.Http;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Diagnostics.Contracts;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.LogAndTracing;

internal sealed class StartTracingDiagnosticController(ITraceRecorder traceRecorder) : SyncDiagnosticApiController
{
    public override DiagnosticsRoute GetRoute()
        => new (HttpMethod.Post, DiagnosticApiUrls.LogAndTracing.Tracing);

    public override object? Execute(HttpContext httpContext)
    {
        traceRecorder.StartRecording();

        return "Tracing started";
    }
}
