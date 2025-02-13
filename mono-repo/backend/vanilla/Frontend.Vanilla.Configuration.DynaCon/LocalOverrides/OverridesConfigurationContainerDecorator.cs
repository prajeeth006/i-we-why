using System;
using System.Threading;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Microsoft.Extensions.Caching.Memory;

namespace Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;

/// <summary>
/// Decorator which resolves configuration according to configured overrides if any.
/// </summary>
internal sealed class OverridesConfigurationContainerDecorator(
    IConfigurationContainer inner,
    IMemoryCache memoryCache,
    IOverridesStorage overridesStorage,
    IChangesetOverrider changesetOverrider)
    : IConfigurationContainer
{
    public static readonly TimeSpan RelativeExpiration = TimeSpan.FromMinutes(10);
    private readonly IMemoryCache memoryCache = memoryCache.IsolateBy("Van:Config:Overrides");
    private volatile CancellationTokenSource configChangeSource = new ();

    public IConfigurationSnapshot GetSnapshot()
    {
        if (overridesStorage.CurrentContextId == null)
            return inner.GetSnapshot();

        return memoryCache.GetOrCreate(overridesStorage.CurrentContextId, cacheEntry =>
        {
            var configChangeToken = configChangeSource.GetChangeToken(); // Before snapshot retrieval to make sure it doesn't change in the meantime
            var snapshot = inner.GetSnapshot(); // Outside try-catch b/c unrelated to overrides

            try
            {
                var overridesChangeToken = overridesStorage.WatchChanges();
                var overridesJson = overridesStorage.Get();
                cacheEntry.AbsoluteExpirationRelativeToNow = RelativeExpiration;
                cacheEntry.ExpirationTokens.Add(overridesChangeToken, configChangeToken);

                var overriddenChangeset = changesetOverrider.Override(snapshot.ActiveChangeset, overridesJson);

                return new ConfigurationSnapshot(snapshot.ActiveChangeset, snapshot.FutureChangesets, overriddenChangeset);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed applying overrides from configured storage to active changeset {snapshot.ActiveChangeset.Id}.", ex);
            }
        })!;
    }

    public void SetSnapshot(SetSnapshotDelegate func)
    {
        inner.SetSnapshot(func);

        configChangeSource.Cancel();
        configChangeSource = new CancellationTokenSource();
    }
}
