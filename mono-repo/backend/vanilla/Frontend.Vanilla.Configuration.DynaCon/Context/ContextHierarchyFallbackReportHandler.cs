using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.Context;

/// <summary>
/// Defines details of the report related to the file with a fallback context hierarchy.
/// </summary>
internal sealed class ContextHierarchyFallbackReportHandler(ICurrentContextHierarchy currentContextHierarchy) : IFallbackReportHandler
{
    public TrimmedRequiredString DataDescription { get; } = "current context hierarchy (shared between all tenants)";

    public bool IsFallenBack(IConfigurationSnapshot snapshot)
        => currentContextHierarchy.Value.Source == ConfigurationSource.FallbackFile;

    public void SetReport(ConfigurationReport globalReport, object fallbackReport)
        => globalReport.ContextHierarchyFallbackFile = fallbackReport;
}
