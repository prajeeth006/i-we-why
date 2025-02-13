using System;
using System.Linq;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.Collections;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Configuration.DynaCon.Polling.Changes;

/// <summary>
/// Checks for configuration changes and applies corresponding changes (determined by the inner processor).
/// </summary>
internal sealed class PollForChangesJob(
    IConfigurationContainer container,
    IConfigurationRestService restService,
    IChangesProcessor processor,
    ICurrentContextHierarchy currentContextHierarchy,
    ILogger<PollForChangesJob> log)
    : IScheduledJob
{
    public TimeSpan? GetInterval(DynaConEngineSettings settings)
        => settings.ChangesPollingInterval;

    public void Execute()
    {
        var fromChangesetId = container.GetSnapshot().LatestChangeset.Id;
        var configurationChanges = restService.GetConfigurationChanges(fromChangesetId);
        var changes = configurationChanges.Select(c => c.ChangesetId).Join();
        log.LogInformation("Poll request for configuration changes {fromChangesetId} found these new {changes}", fromChangesetId, changes);

        if (configurationChanges.Count > 0)
            container.SetSnapshot(s => processor.Process(s!, configurationChanges, currentContextHierarchy.Value));
    }
}
