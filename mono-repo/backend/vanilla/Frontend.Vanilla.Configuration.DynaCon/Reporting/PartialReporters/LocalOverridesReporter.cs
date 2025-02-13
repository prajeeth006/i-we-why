using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;

/// <summary>
/// Reports state of local overrides - session or file.
/// </summary>
internal sealed class LocalOverridesReporter(
    DynaConEngineSettings settings,
    TenantSettings tenantSettings,
    IFileSystem fileSystem,
    IConfigurationOverridesService overridesService)
    : IPartialConfigurationReporter
{
    public const string FileError = "Failed reading overrides file.";

    public async Task FillAsync(ConfigurationReport report, IConfigurationSnapshot snapshot, CancellationToken cancellationToken)
        => report.LocalOverrides = settings.LocalOverridesMode switch
        {
            LocalOverridesMode.File => await GetFileOverridesReportAsync(report, cancellationToken),
            LocalOverridesMode.Session => GetSessionOverridesReport(),
            LocalOverridesMode.Disabled => GetDisabledOverridesReport(),
            _ => throw new VanillaBugException(),
        };

    private async Task<LocalFileOverridesReport> GetFileOverridesReportAsync(ConfigurationReport fullReport, CancellationToken cancellationToken)
    {
        var report = new LocalFileOverridesReport
        {
            Mode = LocalOverridesMode.File,
            OverridesJson = overridesService.GetJson(),
            Path = tenantSettings.LocalOverridesFile ?? throw new VanillaBugException(),
        };

        try
        {
            report.Properties = fileSystem.GetFileProperties(tenantSettings.LocalOverridesFile);
            report.Content = report.Properties != null
                ? await fileSystem.ReadFileTextAsync(tenantSettings.LocalOverridesFile, cancellationToken)
                : null;
        }
        catch (Exception ex)
        {
            fullReport.CriticalErrors.Add(FileError, ex);
        }

        return report;
    }

    private LocalOverridesReport GetSessionOverridesReport()
        => new LocalOverridesReport
        {
            Mode = LocalOverridesMode.Session,
            OverridesJson = overridesService.GetJson(),
        };

    private LocalOverridesReport GetDisabledOverridesReport()
        => new LocalOverridesReport
        {
            Mode = LocalOverridesMode.Disabled,
        };
}
