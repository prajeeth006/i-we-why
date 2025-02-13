using System;
using System.Diagnostics;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.ServerUtils;

namespace Frontend.Vanilla.Features.Diagnostics;

internal sealed class ServerInfoDiagnosticProvider(IEnvironmentProvider envProvider, IClock clock, IServerIPProvider serverIpProvider) : SyncDiagnosticInfoProvider
{
    public override DiagnosticInfoMetadata Metadata { get; } = new (
        name: "Server Info",
        urlPath: "server",
        shortDescription: "Global info about the server.");

    public override object GetDiagnosticInfo()
    {
        var now = clock.UtcNow;
        var startTime = new UtcDateTime(Process.GetCurrentProcess().StartTime.ToUniversalTime());

        return new
        {
            envProvider.Environment,
            envProvider.CurrentLabel,
            CurrentTime = now,
            startTime,
            Uptime = now - startTime,
            Environment.MachineName,
            serverIpProvider.IPAddress,
        };
    }
}
