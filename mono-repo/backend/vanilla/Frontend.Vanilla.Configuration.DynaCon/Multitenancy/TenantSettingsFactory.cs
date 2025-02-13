using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.Multitenancy;

/// <summary>
/// Creates settings for a tenant.
/// </summary>
internal interface ITenantSettingsFactory
{
    TenantSettings Create(TrimmedRequiredString tenantName);
}

internal sealed class SingleTenantSettingsFactory(DynaConEngineSettings settings) : ITenantSettingsFactory
{
    public TenantSettings Create(TrimmedRequiredString tenantName)
        => settings.TenantBlueprint;
}
