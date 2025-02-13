using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.FileFallback;

/// <summary>
/// Defines details of the report related to the file with a fallback changeset.
/// </summary>
internal sealed class ChangesetFallbackReportHandler : IFallbackReportHandler
{
    public TrimmedRequiredString DataDescription { get; } = "changeset";

    public bool IsFallenBack(IConfigurationSnapshot snapshot)
        => snapshot.ActiveChangeset.Source == ConfigurationSource.FallbackFile;

    public void SetReport(ConfigurationReport globalReport, object fallbackReport)
        => globalReport.ChangesetFallbackFile = fallbackReport;
}
