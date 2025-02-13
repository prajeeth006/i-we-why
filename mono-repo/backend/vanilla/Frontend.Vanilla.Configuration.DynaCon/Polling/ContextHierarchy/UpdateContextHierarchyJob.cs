using System;
using Frontend.Vanilla.Configuration.DynaCon.Context;

namespace Frontend.Vanilla.Configuration.DynaCon.Polling.ContextHierarchy;

/// <summary>
/// Updates common instance of context variation hierarchy as far as it's not bound to a changeset.
/// </summary>
internal sealed class UpdateContextHierarchyJob(ICurrentContextHierarchyManager currentContextHierarchy, IContextHierarchyRestService restService)
    : IScheduledJob
{
    public TimeSpan? GetInterval(DynaConEngineSettings settings)
        => settings.ChangesPollingInterval;

    public void Execute()
    {
        var hierarchy = restService.Get();
        currentContextHierarchy.Set(hierarchy);
    }
}
