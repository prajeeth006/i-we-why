using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;
using Frontend.Vanilla.Core.System.Text;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;

/// <summary>
/// Reports info regarding fallback file status. It is used in <c>/health/config</c>.
/// </summary>
internal sealed class FallbackFileReporter<TData>(IFallbackFile<TData> fallbackFile, IFallbackReportHandler reportHandler) : IPartialConfigurationReporter
    where TData : class
{
    public async Task FillAsync(ConfigurationReport globalReport, IConfigurationSnapshot snapshot, CancellationToken cancellationToken)
    {
        if (fallbackFile.Handler == null)
        {
            reportHandler.SetReport(globalReport, FallbackFileReportMessages.Disabled);

            return;
        }

        var report = new FallbackFileReport { Path = fallbackFile.Handler.Path };
        reportHandler.SetReport(globalReport, report);

        if (reportHandler.IsFallenBack(snapshot))
            AddCriticalError(FallbackFileReportMessages.UsingFallbackFormat, true);

        try
        {
            report.Properties = fallbackFile.Handler.GetProperties();
            var content = await fallbackFile.Handler.ReadAsync(cancellationToken); // Execute this as last b/c it's more likely to fail
            report.Content = JsonConvert.SerializeObject(content);
        }
        catch (Exception ex)
        {
            AddCriticalError(FallbackFileReportMessages.ErrorFormat, ex);
        }

        void AddCriticalError(string messageFormat, object error)
        {
            var message = string.Format(messageFormat, reportHandler.DataDescription);
            globalReport.CriticalErrors.Add(message, error);
        }
    }
}

internal interface IFallbackReportHandler
{
    TrimmedRequiredString DataDescription { get; }
    bool IsFallenBack(IConfigurationSnapshot snapshot);
    void SetReport(ConfigurationReport globalReport, object fallbackReport);
}

internal static class FallbackFileReportMessages
{
    public const string Disabled = "File fallback is disabled.";

    public const string ErrorFormat =
        "Error collecting details about fallback file with {0}. Fix the error and wait for next polling request or restart the application to get the file overwritten.";

    public const string UsingFallbackFormat = "Using current {0} from the fallback file.";
}
