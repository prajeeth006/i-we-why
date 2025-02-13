using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Features.DeviceAtlas;

/// <summary>
/// Checks DeviceAtlas to be operational.
/// </summary>
internal sealed class DeviceAtlasHealthCheck(IDeviceAtlasService deviceAtlasService) : IHealthCheck
{
    public bool IsEnabled => true;

    public HealthCheckMetadata Metadata { get; } = new (
        name: "DeviceAtlas",
        severity: HealthCheckSeverity.Critical,
        description: "Checks DeviceAtlas API service to be operational.",
        whatToDoIfFailed: "Check the connectivity to DeviceAtlas API service according to the settings (/health/info/app-config), check DeviceAtlas /health endpoint and inspect logs.",
        documentationUri: new Uri("https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/main/backend/vanilla/Frontend.DeviceAtlas.Api/README.md"));

    public async Task<HealthCheckResult> ExecuteAsync(CancellationToken cancellationToken)
    {
        var details = await deviceAtlasService.GetAsync(ExecutionMode.Async(cancellationToken));
        var result = details.Item1
            ? HealthCheckResult.CreateSuccess(details.Item2)
            : HealthCheckResult.CreateFailed("Failed to execute device atlas health check.");

        return result;
    }
}
