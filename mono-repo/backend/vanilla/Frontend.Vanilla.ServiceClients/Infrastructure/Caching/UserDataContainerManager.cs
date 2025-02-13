#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.ServiceClients.Security;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Caching;

/// <summary>
/// Manages container with user data according to app context (e.g. HttpContext)
/// - Loads them from distributed cache lazily when needed, then stored in the context.
/// - Saves them back to distributed cache at the end of the context.
/// </summary>
internal interface IUserDataContainerManager
{
    Task<UserDataContainer> GetContainerAsync(ExecutionMode mode, PosApiAuthTokens authTokens);
}

internal sealed class UserDataContainerManager(
    ILabelIsolatedDistributedCache distributedCache,
    ICurrentContextAccessor currentContextAccessor,
    ICurrentUserAccessor currentUserAccessor,
    IPosApiCacheDiagnostics cacheDiagnostics,
    IClock clock,
    ILogger<UserDataContainerManager> log)
    : IUserDataContainerManager, ICurrentContextSwitchHandler
{
    private const string DiagnosticsKey = "__Created";

    public Task<UserDataContainer> GetContainerAsync(ExecutionMode mode, PosApiAuthTokens authTokens)
    {
        var containerKey = GetContainerKey(authTokens);
        var container = currentContextAccessor.Items.GetOrAddFromFactory(containerKey, GetContainerFromDistributedCache);

        return !container.IsDisposed
            ? Task.FromResult(container)
            : throw UserDataContainer.GetDisposedException();
    }

    private UserDataContainer GetContainerFromDistributedCache(string containerKey)
    {
        // Sync b/c IClientConfigProvider-s are executed at parallel by single thread, both async and sync -> no way how to lock without deadlock
        var json = distributedCache.GetString(containerKey);

        var items = json != null ? DeserializeContainerItems(json) : new Dictionary<string, UserDataItem>();
        items.Remove(DiagnosticsKey);

        return new UserDataContainer(items);
    }

    private IDictionary<string, UserDataItem> DeserializeContainerItems(string json)
    {
        try
        {
            return JsonConvert.DeserializeObject<IDictionary<string, UserDataItem>>(json) ?? new Dictionary<string, UserDataItem>();
        }
        catch (Exception ex)
        {
            var msg =
                "Failed deserializing cached PosAPI user data from {json} retrieved from distributed cache. It may be caused by their incompatible data format betweens product apps."
                + " There is no user impact, fresh data will be used but response wil be slower. Data will be written to distributed cache which may lead to this error in other apps.";
            log.LogError(ex, msg, json);

            return new Dictionary<string, UserDataItem>();
        }
    }

    public async Task OnContextEndAsync(CancellationToken cancellationToken)
    {
        try
        {
            var authTokens = currentUserAccessor.User.GetPosApiAuthTokens();

            if (authTokens == null)
                return; // Anonymous, if some data left in distributed cache after logout -> no tokens to access them anyway -> will expire

            var containerKey = GetContainerKey(authTokens);
            var container = (UserDataContainer?)currentContextAccessor.Items.GetValue(containerKey)?.Value;

            if (container == null)
                return; // Either no data cached or not touched during this request -> keep distributed cache as it is

            container.Dispose();

            var now = clock.UtcNow;
            var expiredItems = container.Items.Where(i => i.Value.Expires <= now).ToList();
            expiredItems.Each(i => container.Items.Remove(i.Key));
            container.IsModified |= expiredItems.Count > 0;

            if (!container.IsModified)
                return;

            if (container.Items.Count == 0)
            {
                await distributedCache.RemoveAsync(containerKey, cancellationToken);

                return;
            }

            var diagnosticInfo = cacheDiagnostics.GetInfo();
            container.Items[DiagnosticsKey] = new UserDataItem(JToken.FromObject(diagnosticInfo), default);
            var json = JsonConvert.SerializeObject(container.Items);
            var expires = container.Items.Select(i => i.Value.Expires).Max(); // Apply the longest of items' cache times
            await distributedCache.SetStringAsync(containerKey, json, new DistributedCacheEntryOptions { AbsoluteExpiration = expires.Value }, cancellationToken);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed writing cached PosAPI user data to distributed cached");
        }
    }

    // DON'T CHANGE B/C DISTRIBUTED CACHED -> IT WILL BREAK COMPATIBILITY BETWEEN APPS WITH DIFFERENT VANILLA ON THE SAME LABEL!!!
    private static string GetContainerKey(PosApiAuthTokens authTokens)
        => "Van:PosApi:UserData:" + authTokens.SessionToken;

    public Task OnContextBeginAsync(CancellationToken cancellationToken)
        => Task.CompletedTask;
}
