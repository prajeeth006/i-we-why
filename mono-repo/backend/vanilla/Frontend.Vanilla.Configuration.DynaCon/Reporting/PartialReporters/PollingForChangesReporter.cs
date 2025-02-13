using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Polling;
using Frontend.Vanilla.Configuration.DynaCon.Polling.Changes;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;

/// <summary>
/// Reports state of polling DynaCon service for configuration changes.
/// </summary>
internal sealed class PollingForChangesReporter(IConfigurationServiceUrls urls, IPollingScheduler<PollForChangesJob> pollForChangesScheduler)
    : SyncPartialConfigurationReporter
{
    public const string DisabledMessage = "Polling for changes is disabled.";

    public override void Fill(ConfigurationReport report, IConfigurationSnapshot snapshot)
        => report.PollingForChanges = pollForChangesScheduler.NextPollTime is UtcDateTime nextPollTime
            ? new PollingForChangesReport
            {
                NextPollTime = nextPollTime,
                FromChangesetId = snapshot.LatestChangeset.Id,
                Url = urls.ConfigurationChanges(snapshot.LatestChangeset.Id),
            }
            : DisabledMessage;
}
