using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Frontend.DeviceAtlas.Api.Application;

internal sealed class DeviceAtlasHealthCheck : IHealthCheck
{
    private static TimeSpan LoadIntervalWithGracePeriod { get; } =
        DeviceAtlasDataBackgroundService.LoadInterval.Add(TimeSpan.FromHours(1));
    private readonly IDeviceAtlasService deviceAtlasService;
    private readonly ILogger<DeviceAtlasHealthCheck> logger;

    public DeviceAtlasHealthCheck(IDeviceAtlasService deviceAtlasService, ILogger<DeviceAtlasHealthCheck> logger)
    {
        this.deviceAtlasService = deviceAtlasService;
        this.logger = logger;
    }

    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new ())
    {
        var statusWithDescription = GetStatusWithDescription(deviceAtlasService.LastLoadUtcDateTime);

        try
        {
            var data = new Dictionary<string, object>
            {
                { nameof(deviceAtlasService.DataVersion), deviceAtlasService.DataVersion ?? string.Empty },
                { nameof(deviceAtlasService.ApiVersion), deviceAtlasService.ApiVersion ?? string.Empty },
                { nameof(deviceAtlasService.DataCreationUtcDateTime), deviceAtlasService.DataCreationUtcDateTime.HasValue ? deviceAtlasService.DataCreationUtcDateTime.Value : string.Empty },
                { nameof(deviceAtlasService.LastLoadUtcDateTime), deviceAtlasService.LastLoadUtcDateTime.HasValue ? deviceAtlasService.LastLoadUtcDateTime.Value : string.Empty },
            };
            return Task.FromResult(new HealthCheckResult(statusWithDescription.Item1, statusWithDescription.Item2, null, data));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to execute health check.");
            return Task.FromResult(new HealthCheckResult(HealthStatus.Unhealthy, ex.Message));
        }
    }

    private static (HealthStatus, string) GetStatusWithDescription(DateTime? lastLoadUtc)
    {
        if (lastLoadUtc.HasValue is false)
        {
            return (HealthStatus.Unhealthy, "FAILED");
        }

        var utcNow = DateTime.UtcNow;
        var timeSinceLastLoad = utcNow.Subtract(lastLoadUtc.Value);
        if (timeSinceLastLoad > LoadIntervalWithGracePeriod)
        {
            return (HealthStatus.Degraded, $"DEGRADED because last data load should have happened within {LoadIntervalWithGracePeriod} but it didn't after {timeSinceLastLoad}. UtcNow is {utcNow} and last load was {lastLoadUtc}.");
        }

        return (HealthStatus.Healthy, "OK");
    }
}
