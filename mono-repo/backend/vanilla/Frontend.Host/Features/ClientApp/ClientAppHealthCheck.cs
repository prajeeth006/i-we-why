using System.Net;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Reflection;
using Microsoft.Extensions.Logging;

namespace Frontend.Host.Features.ClientApp;

/// <summary>
/// Health check for Frontend CDN.
/// </summary>
internal sealed class ClientAppHealthCheck(
    IClientAppService service,
    VanillaVersion vanillaVersion,
    ILogger<ClientAppHealthCheck> logger)
    : IHealthCheck
{
    public bool IsEnabled => service.Mode == ClientAppMode.FileServer;

    public HealthCheckMetadata Metadata { get; } = new (
        "Frontend CDN",
        ClientAppHealthCheckConstants.Description,
        ClientAppHealthCheckConstants.WhatToDoIfFailed,
        HealthCheckSeverity.Critical,
        ClientAppConfiguration.FeatureName);

    public async Task<HealthCheckResult> ExecuteAsync(CancellationToken cancellationToken)
    {
        try
        {
            var availableVersions = await service.GetAvailableVersionsAsync(cancellationToken);
            var currentVersion = await service.GetCurrentVersionAsync(cancellationToken);

            return HealthCheckResult.CreateSuccess(new { currentVersion, availableVersions, vanillaVersion });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to execute client app health check");

            return HealthCheckResult.CreateFailed("Failed to execute client app health check.");
        }
    }
}

internal static class ClientAppHealthCheckConstants
{
    public const string Description = "Checks the availability and connectivity between this server and CDN. Succeeds if connection is established successfully.";

    public const string WhatToDoIfFailed =
        "Check the connectivity and availability of CDN instance. Use /health/httpTester page to check if server is able to reach CDN. Contact Leanops B2C Sports team.";
}
