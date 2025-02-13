using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.RestService;

namespace Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;

/// <summary>
/// Reports data regarding active/next/previous changesets etc.
/// </summary>
internal sealed class ChangesetReporter(IConfigurationServiceUrls urls, IHistoryLog<PastChangesetInfo> pastChangesetsLog) : SyncPartialConfigurationReporter
{
    public const string InvalidLatestChangesetError = "The latest future changeset is invalid. Fix it in DynaCon admin web and wait until application picks it up."
                                                      + " This error doesn't have any user impact but should be fixed asap because it completely blocks all other configuration changes.";

    public const string ActiveChangesetWarning = "Active changeset contains warnings.";

    public override void Fill(ConfigurationReport report, IConfigurationSnapshot snapshot)
    {
        report.Configuration = new ChangesetReport
        {
            Active = snapshot.ActiveChangeset,
            Overridden = snapshot.OverriddenChangeset,
            Future = snapshot.FutureChangesets,
            Past = pastChangesetsLog.GetItems(),
        };

        report.Urls = urls;
        report.Snapshot = snapshot;

        if (snapshot.LatestChangeset is IFailedChangeset)
            report.CriticalErrors.Add(InvalidLatestChangesetError, snapshot.LatestChangeset);

        if (snapshot.ActiveChangeset.Warnings.Count > 0)
            report.Warnings.Add(ActiveChangesetWarning, snapshot.ActiveChangeset.Warnings);
    }
}
