namespace Frontend.Host.Features.PartyTown;

internal interface IPartyTownConfiguration
{
    bool IsEnabled { get; }
    bool EnableDebugMode { get; }
    bool LogSendBeaconRequests { get; }
    bool LogStackTraces { get; }
    int FallbackTimeout { get; }
    bool LogGetters { get; }
    bool LogSetters { get; }
    bool EnableEventReplay { get; }
    string[] ProxiedHosts { get; }
    string[] ScriptsOnMainThread { get; }
    string[] GlobalFns { get; }
    string[] IgnoreKeepAliveBeaconHosts { get; }
    string? ServiceWorkerPath { get; }
    object? ForwardedFunctionCalls { get; }
}

internal sealed class PartyTownConfiguration : IPartyTownConfiguration
{
    public const string FeatureName = "Host.Features.PartyTown";
    public bool IsEnabled { get; set; }
    public bool EnableDebugMode { get; set; }
    public bool LogSendBeaconRequests { get; set; }
    public bool LogStackTraces { get; set; }
    public int FallbackTimeout { get; set; }
    public bool LogGetters { get; set; }
    public bool LogSetters { get; set; }
    public bool EnableEventReplay { get; set; }
    public string? ServiceWorkerPath { get; set; }
    public string[] GlobalFns { get; set; } = Array.Empty<string>();
    public string[] IgnoreKeepAliveBeaconHosts { get; set; } = Array.Empty<string>();
    public string[] ProxiedHosts { get; set; } = Array.Empty<string>();
    public string[] ScriptsOnMainThread { get; set; } = Array.Empty<string>();
    public object? ForwardedFunctionCalls { get; set; } = null;
}
