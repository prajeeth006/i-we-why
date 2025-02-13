using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Initialization;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Configuration.DynaCon.Reporting;

/// <summary>
/// Reports configuration status by collecting data from partial reporters.
/// It is used in <c>/health/config</c> and health check.
/// </summary>
internal interface IConfigurationReporter
{
    Task<ConfigurationReport> GetReportAsync(CancellationToken cancellationToken, bool maskSensitiveData = false);
}

internal sealed class ConfigurationReporter(
    IConfigurationContainer container,
    IInitialChangesetLoader initialChangesetLoader,
    IEnumerable<IPartialConfigurationReporter> partialReporters)
    : IConfigurationReporter
{
    public const string ReportBuildingFailedMessage = "Failed building configuration health report.";
    private readonly IReadOnlyList<IPartialConfigurationReporter> partialReporters = partialReporters.ToList();

    public async Task<ConfigurationReport> GetReportAsync(CancellationToken cancellationToken, bool maskSensitiveData = false)
    {
        var report = new ConfigurationReport();
        var buildingErrors = new List<Exception>();
        var snapshot = maskSensitiveData ? initialChangesetLoader.GetConfiguration(true) : container.GetSnapshot();

        await Task.WhenAll(partialReporters.ConvertAll(async reporter =>
        {
            try
            {
                await reporter.FillAsync(report, snapshot, cancellationToken);
            }
            catch (Exception ex)
            {
                buildingErrors.Add(ex);
            }
        }));

        if (buildingErrors.Count > 0)
        {
            report.CriticalErrors.Add(ReportBuildingFailedMessage, buildingErrors.Count > 1 ? buildingErrors : buildingErrors[0]);
        }

        return report;
    }
}
