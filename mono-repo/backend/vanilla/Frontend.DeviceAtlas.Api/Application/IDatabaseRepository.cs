namespace Frontend.DeviceAtlas.Api.Application;

internal interface IDatabaseRepository
{
    Task<int> HealthCheckAsync(CancellationToken cancellationToken);
    Task<string> GetDeviceAtlasAsync(CancellationToken cancellationToken);
}
