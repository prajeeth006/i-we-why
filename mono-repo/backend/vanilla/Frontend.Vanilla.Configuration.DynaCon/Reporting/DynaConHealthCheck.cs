using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Diagnostics.Health;

namespace Frontend.Vanilla.Configuration.DynaCon.Reporting;

/// <summary>
/// Checks overall state of the configuration loaded from DynaCon.
/// </summary>
internal sealed class DynaConHealthCheck(IConfigurationReporter reporter) : IHealthCheck
{
    public bool IsEnabled => true;

    public HealthCheckMetadata Metadata { get; } = new (
        name: "DynaCon Configuration",
        severity: HealthCheckSeverity.Critical,
        description: "Checks the state of the configuration retrieved from DynaCon service. See /health/config for more details.",
        whatToDoIfFailed: "Check inner details of the Error for more information and suggestions what to do.",
        documentationUri: new Uri("https://docs.vanilla.intranet/configuration-system.html#functional-configuration-dynacon"));

    public async Task<HealthCheckResult> ExecuteAsync(CancellationToken cancellationToken)
    {
        var report = await reporter.GetReportAsync(cancellationToken);

        return report.CriticalErrors.Count > 0
            ? HealthCheckResult.CreateFailed(report.CriticalErrors)
            : HealthCheckResult.Success;
    }
}
