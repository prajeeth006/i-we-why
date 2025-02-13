using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Diagnostics.Contracts.Health;

public sealed class HealthReportResult(string? serverId, string clientIp, string environment, JObject details, bool allPassed)
{
    public string? ServerId { get; } = serverId;
    public string ClientIp { get; } = clientIp;
    public string Environment { get; } = environment;
    public JObject Details { get; } = details;
    public bool AllPassed { get; } = allPassed;
    public string OverallResult => AllPassed ? "CHECK_OK" : "CHECK_FAILED";
}
