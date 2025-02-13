using System.Text;
using Com.DeviceAtlas.Device;

namespace Frontend.DeviceAtlas.Api.Application;

internal interface IDeviceAtlasService
{
    string? DataVersion { get; }
    string? ApiVersion { get; }
    DateTime? DataCreationUtcDateTime { get; }
    DateTime? LastLoadUtcDateTime { get; }
    IReadOnlyDictionary<string, string> GetDeviceProperties(IDictionary<string, string> headers, string? clientSideProperties);
    Task LoadDataAsync(CancellationToken cancellationToken);
}

internal sealed class DeviceAtlasService : IDeviceAtlasService
{
    private readonly IDatabaseRepository databaseRepository;
    private readonly ILogger<DeviceAtlasService> logger;
    private DeviceApi api = new (new Config { MaxCacheEntries = 0 });
    public string? DataVersion => api.GetDataVersion();
    public string? ApiVersion => api.GetDeviceAtlasApiVersion();
    public DateTime? DataCreationUtcDateTime { get; private set; }
    public DateTime? LastLoadUtcDateTime { get; private set; }

    public DeviceAtlasService(IDatabaseRepository databaseRepository, ILogger<DeviceAtlasService> logger)
    {
        this.databaseRepository = databaseRepository;
        this.logger = logger;
    }

    public async Task LoadDataAsync(CancellationToken cancellationToken)
    {
        var data = await databaseRepository.GetDeviceAtlasAsync(cancellationToken);
        api.LoadDataFromStream(new MemoryStream(Encoding.UTF8.GetBytes(data)));
        var creationTime = api.GetDataCreationTimestamp();
        if (creationTime is not null)
        {
            DataCreationUtcDateTime =
                new DateTime(DateTimeOffset.FromUnixTimeSeconds(creationTime.Value).ToUniversalTime().Ticks,
                    DateTimeKind.Utc);
        }

        LastLoadUtcDateTime = DateTime.UtcNow;
        logger.LogWarning("Successfully reloaded device atlas data.");
    }

    public IReadOnlyDictionary<string, string> GetDeviceProperties(IDictionary<string, string> headers, string? clientSideProperties)
    {
        return api.GetProperties(headers, clientSideProperties).ToDictionary(p => p.Key, p => p.Value.ToString());
    }
}
