using System.Linq;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;

namespace Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;

/// <summary>
/// Reports tenant details in multitenant setup.
/// </summary>
internal sealed class MultitenancyReporter(ITenantManager tenantManager) : SyncPartialConfigurationReporter
{
    public override void Fill(ConfigurationReport report, IConfigurationSnapshot snapshot)
    {
        var tenants = tenantManager.GetActiveTenants();
        report.Multitenancy = tenants.ToDictionary(t => t.Key, t => new TenantReport
        {
            StartTime = t.Value.StartTime,
            LastAccessTime = t.Value.LastAccessTime,
            TotalAccessCount = t.Value.AccessCount,
        });
    }
}
