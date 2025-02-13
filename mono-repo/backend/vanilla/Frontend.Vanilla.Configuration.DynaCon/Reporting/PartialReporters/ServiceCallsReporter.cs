using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Time;

namespace Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;

/// <summary>
/// Reports state of REST calls to DynaCon service.
/// </summary>
internal sealed class ServiceCallsReporter(IHistoryLog<RestServiceCallInfo> restServiceLog, IClock clock) : SyncPartialConfigurationReporter
{
    public const int CallCountForError = 3;
    public static readonly TimeSpan TimeSpanForWarning = TimeSpan.FromHours(1);

    public const string ServiceAccessError =
        "The latest HTTP request(s) to DynaCon API service failed. Fix the access according to the error(s) and wait for next request (if some polling is enabled) or restart the app.";

    public const string ServiceAccessWarning = "Some HTTP requests to DynaCon API service failed recently (last hour).";

    public override void Fill(ConfigurationReport report, IConfigurationSnapshot snapshot)
    {
        report.ServiceCalls = restServiceLog.GetItems();

        AddCalls(report.CriticalErrors, ServiceAccessError, report.ServiceCalls
            .OrderByDescending(c => c.Time)
            .Take(CallCountForError)
            .Where(c => c.Error != null));

        var warningMinTime = clock.UtcNow - TimeSpanForWarning;
        AddCalls(report.Warnings, ServiceAccessWarning, report.ServiceCalls
            .Where(c => c.Error != null && c.Time.Value > warningMinTime.Value)
            .OrderByDescending(c => c.Time));
    }

    private static void AddCalls(IDictionary<TrimmedRequiredString, object> report, string message, IEnumerable<RestServiceCallInfo> calls)
    {
        var callList = calls.Enumerate();
        if (callList.Count > 0)
            report.Add(message, callList);
    }
}
