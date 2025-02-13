namespace Frontend.Host.Features.ClientConfig;

internal sealed class ClientConfigAppInfo(bool enabled, string? header, string? keyOverride, Uri? url)
{
    public bool Enabled { get; set; } = enabled;
    public string? Header { get; } = header;
    public string? KeyOverride { get; } = keyOverride;
    public Uri? Url { get; } = url;
}

internal interface IClientConfigConfiguration
{
    IReadOnlyDictionary<string, ClientConfigAppInfo> Endpoints { get; }
    int Version { get; }
}

internal class ClientConfigConfiguration(IReadOnlyDictionary<string, ClientConfigAppInfo> endpoints)
    : IClientConfigConfiguration
{
    public const string FeatureName = "Host.Features.ClientConfig";
    public IReadOnlyDictionary<string, ClientConfigAppInfo> Endpoints { get; set; } = endpoints;
    public int Version { get; set; }
}
