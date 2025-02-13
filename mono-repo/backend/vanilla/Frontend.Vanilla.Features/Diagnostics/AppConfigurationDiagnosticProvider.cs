using Frontend.Vanilla.Core.Diagnostics;
using Microsoft.Extensions.Configuration;

namespace Frontend.Vanilla.Features.Diagnostics;

internal sealed class AppConfigurationDiagnosticProvider(IConfiguration configurationRoot) : SyncDiagnosticInfoProvider
{
    public override DiagnosticInfoMetadata Metadata { get; } = new (
        name: "App Configuration",
        urlPath: "app-config",
        shortDescription: "Displays application's configuration");

    public override object GetDiagnosticInfo()
    {
        return ((IConfigurationRoot)configurationRoot).GetDebugView(); // todo remove machine-key someday
    }
}
