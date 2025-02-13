using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Polling;
using Frontend.Vanilla.Configuration.DynaCon.Polling.ProactiveValidation;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;

/// <summary>
/// Reports state of polling for changesets in order to proactively validate them.
/// </summary>
internal sealed class ProactiveValidationReporter(
    IHistoryLog<ValidatedChangesetInfo> validatedLog,
    IPollingScheduler<ProactiveValidationJob> scheduler,
    IConfigurationServiceUrls urls)
    : SyncPartialConfigurationReporter
{
    public const string DisabledMessage = "Polling for changesets in order to proactively validate them is disabled.";

    public override void Fill(ConfigurationReport report, IConfigurationSnapshot snapshot)
        => report.ProactiveValidation = scheduler.NextPollTime is UtcDateTime nextPollTime
            ? new ProactiveValidationReport
            {
                PastValidations = validatedLog.GetItems(),
                NextPollTime = nextPollTime,
                Url = urls.ValidatableChangesets,
            }
            : DisabledMessage;
}
