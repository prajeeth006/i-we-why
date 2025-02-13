namespace Frontend.DeviceAtlas.Api.Application;

internal sealed class DeviceAtlasDataBackgroundService(IDeviceAtlasService deviceAtlasService, ILogger<DeviceAtlasDataBackgroundService> logger)
    : BackgroundService
{
    public static TimeSpan LoadInterval { get; } = TimeSpan.FromDays(1);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        logger.LogInformation($"Starting {nameof(DeviceAtlasDataBackgroundService)}.{nameof(ExecuteAsync)}.");

        using PeriodicTimer timer = new (LoadInterval);

        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                await deviceAtlasService.LoadDataAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"{nameof(DeviceAtlasDataBackgroundService)}.{nameof(ExecuteAsync)} failed.");
            }
        }
    }
}
