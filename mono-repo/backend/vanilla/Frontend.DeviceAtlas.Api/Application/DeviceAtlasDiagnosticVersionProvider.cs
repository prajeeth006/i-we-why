using Vanilla.Extensions.Diagnostics.SiteVersion;

namespace Frontend.DeviceAtlas.Api.Application;

public class DeviceAtlasDiagnosticVersionProvider : IDiagnosticVersionProvider
{
    public string Name => "device-atlas-api";
    public string Version { get; } = typeof(DeviceAtlasDiagnosticVersionProvider).Assembly.GetFullVersion();
}
