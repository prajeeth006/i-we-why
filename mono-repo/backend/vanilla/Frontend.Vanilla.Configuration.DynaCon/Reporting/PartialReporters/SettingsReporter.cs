using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;

/// <summary>
/// Reports configuration settings.
/// </summary>
internal sealed class SettingsReporter(DynaConEngineSettings engineSettings, TenantSettings tenantSettings, IEnumerable<IConfigurationInfo> configInfos)
    : SyncPartialConfigurationReporter
{
    private readonly IReadOnlyList<IConfigurationInfo> configInfos = configInfos.ToArray();

    public override void Fill(ConfigurationReport report, IConfigurationSnapshot snapshot)
    {
        report.Settings = new SettingsReport
        {
            Engine = engineSettings,
            CurrentTenant = tenantSettings,
        };
        report.FeaturesMetadata = configInfos;
    }
}
