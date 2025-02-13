using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Diagnostics.Contracts;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.ServerUtils;

internal sealed class ServerInfoDiagnosticController(IEnvironmentProvider environmentProvider, IServerIPProvider serverIpProvider) : SyncDiagnosticApiController
{
    public override DiagnosticsRoute GetRoute() => DiagnosticApiUrls.ServerInfoUrl;

    public override object? Execute(HttpContext httpContext)
        => $"{environmentProvider.Environment} {serverIpProvider.IPAddress}";
}
