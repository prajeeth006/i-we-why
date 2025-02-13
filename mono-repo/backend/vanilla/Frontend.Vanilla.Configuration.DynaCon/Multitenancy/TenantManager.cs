using System;
using System.Collections.Generic;
using System.Threading;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Time;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Configuration.DynaCon.Multitenancy;

internal interface ITenantManager
{
    IReadOnlyDictionary<TrimmedRequiredString, ITenant> GetActiveTenants();
    ITenant GetCurrentTenant();
}

internal sealed class TenantManager(ICurrentTenantResolver currentTenantResolver, ITenantFactory tenantFactory, IClock clock, ILogger<TenantManager> log)
    : ITenantManager
{
    private readonly ILogger log = log;

    private static readonly IEqualityComparer<TrimmedRequiredString> Comparer = RequiredStringComparer.OrdinalIgnoreCase;
    private volatile IReadOnlyDictionary<TrimmedRequiredString, ITenant> tenants = new Dictionary<TrimmedRequiredString, ITenant>(Comparer);
    private readonly Lock createLock = new ();

    public IReadOnlyDictionary<TrimmedRequiredString, ITenant> GetActiveTenants()
        => tenants;

    public ITenant GetCurrentTenant()
    {
        try
        {
            var tenantName = currentTenantResolver.ResolveName();

            if (!tenants.TryGetValue(tenantName, out var tenant))
                lock (createLock)
                    if (!tenants.TryGetValue(tenantName, out tenant)) // Double-checked locking
                    {
                        tenant = tenantFactory.Create(tenantName);
                        tenants = tenants.Append(KeyValue.Get(tenantName, tenant)).ToDictionary(Comparer);
                    }

            tenant.LastAccessTime = clock.UtcNow;

            return tenant;
        }
        catch (Exception ex)
        {
            const string message = "Failed getting current tenant services. Investigate the exception carefully including inner exceptions.";
            log.LogCritical(ex, message);

            throw new Exception(message, ex);
        }
    }
}
