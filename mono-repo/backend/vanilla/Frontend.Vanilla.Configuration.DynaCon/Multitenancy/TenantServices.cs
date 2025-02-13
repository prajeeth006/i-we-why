using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;

namespace Frontend.Vanilla.Configuration.DynaCon.Multitenancy;

/// <summary>
/// Resolves all top-level scoped services used by a tenant at once. So it makes sure all of them are correctly initialized.
/// </summary>
internal sealed class TenantServices(
    IConfigurationInitializer initializer,
    ICurrentChangesetResolver changesetResolver,
    IConfigurationReporter reporter,
    IConfigurationOverridesService overridesService)
{
    public IConfigurationInitializer Initializer { get; } = initializer;
    public ICurrentChangesetResolver ChangesetResolver { get; } = changesetResolver;
    public IConfigurationReporter Reporter { get; } = reporter;
    public IConfigurationOverridesService OverridesService { get; } = overridesService;
}
