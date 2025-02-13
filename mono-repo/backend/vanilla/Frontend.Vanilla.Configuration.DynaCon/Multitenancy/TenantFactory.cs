using System;
using Frontend.Vanilla.Core.DependencyInjection.ExternallyManaged;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Time;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Configuration.DynaCon.Multitenancy;

/// <summary>
/// Creates a new tenant by loading its configuration and preparing all services.
/// </summary>
internal interface ITenantFactory
{
    ITenant Create(TrimmedRequiredString tenantName);
}

internal sealed class TenantFactory(ITenantSettingsFactory settingsFactory, IServiceScopeFactory scopeFactory, IClock clock)
    : ITenantFactory
{
    public ITenant Create(TrimmedRequiredString tenantName)
    {
        try
        {
            var scope = scopeFactory.CreateScope();
            var settingsManager = scope.ServiceProvider.GetRequiredService<ExternalManager<TenantSettings>>();

            settingsManager.Value = settingsFactory.Create(tenantName);
            var services = scope.ServiceProvider.GetRequiredService<TenantServices>();

            services.Initializer.Initialize();

            return new Tenant(services.ChangesetResolver, services.Reporter, services.OverridesService, clock.UtcNow, scope);
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed initializing tenant '{tenantName}'.", ex);
        }
    }
}
