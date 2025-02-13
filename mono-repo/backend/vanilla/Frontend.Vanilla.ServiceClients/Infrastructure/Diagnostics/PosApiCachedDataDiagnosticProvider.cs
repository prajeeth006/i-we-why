using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure.Caching;
using Frontend.Vanilla.ServiceClients.Security;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Diagnostics;

internal sealed class PosApiCachedDataDiagnosticProvider(
    PosApiDataType dataType,
    IPosApiDataCache cache,
    InterceptedCacheCalls interceptedCacheCalls,
    ICurrentUserAccessor currentUserAccessor)
    : IDiagnosticInfoProvider
{
    public DiagnosticInfoMetadata Metadata { get; } = new (
        name: $"PosApi Cached {dataType} Data",
        urlPath: $"posapi-cached-{dataType.ToString().ToLowerInvariant()}-data",
        shortDescription: $"Lists all currently cached PosAPI {dataType.ToString().ToLowerInvariant()} data.",
        descriptionHtml: $"List is built historically based on calls to {typeof(IPosApiDataCache)} across whole app."
                         + $" Vanilla Framework automatically prepends isolation prefix and appends configured {nameof(IServiceClientsConfiguration.Headers)}"
                         + " to cache keys so that different values can be cached for each configuration and combination.");

    public async Task<object> GetDiagnosticInfoAsync(CancellationToken cancellationToken)
    {
        var calls = interceptedCacheCalls
            .Where(r => r.DataType == dataType)
            .OrderBy(r => r.Key, RequiredStringComparer.OrdinalIgnoreCase);

        var keyedDetails = await Task.WhenAll(calls.Select(async c =>
        {
            var details = await (Task<object>)this.InvokeGeneric(nameof(GetValueDetails), c.ClrType, c.Key, cancellationToken);

            return KeyValue.Get(c.Key, details);
        }));

        return keyedDetails.ToDictionary();
    }

    private async Task<object> GetValueDetails<T>(RequiredString key, CancellationToken cancellationToken)
    {
        var result = new Dictionary<string, object> { { "Type", typeof(T) } };

        try
        {
            if (dataType == PosApiDataType.User && !currentUserAccessor.User.Identity.IsAuthenticated)
            {
                result.Add("Message", "Current user is anonymous so user data obviously can't be retrieved.");

                return result;
            }

            var cacheEntry = await cache.GetAsync<T>(dataType, key, cancellationToken);
            if (cacheEntry != null)
                result.Add("Value", cacheEntry.Value);
            else
                result.Add("HasValue", false);
        }
        catch (Exception ex)
        {
            result.Add("Error", ex);
        }

        return result;
    }
}
