using System;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.LogAndTracing;
using Frontend.Vanilla.Features.App;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Diagnostics.Tracing;
using Frontend.Vanilla.Features.Logging;
using Frontend.Vanilla.Features.OpenTelemetry;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using Serilog.Events;
using Serilog.Formatting;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.LogAndTracing;

internal sealed class LogDiagnosticController(
    ITracingIdsProvider tracingIdsProvider,
    IAppConfiguration appConfig,
    IInMemoryLog log,
    ITextFormatter jsonFormatter,
    ICurrentProductResolver currentProduct,
    ICookieHandler cookieHandler,
    IOpenTelemetryConfiguration openTelemetryConfiguration)
    : SyncDiagnosticApiController
{
    public override DiagnosticsRoute GetRoute() => DiagnosticApiUrls.LogAndTracing.Log.UrlTemplate;

    public override object Execute(HttpContext httpContext)
    {
        var entries = log.GetEntries();
        var ids = tracingIdsProvider.GetTracingIds();

        var onlyMyEntries = bool.TryParse(httpContext.Request.Query[DiagnosticApiUrls.LogAndTracing.Log.OnlyMyEntriesParameter], out var b) && b;
        entries = onlyMyEntries
            ? entries.Where(e => GetCorrelationId(e) == ids.CorrelationId)
            : entries.Where(e => !IsRecordedTrace(e) || GetCorrelationId(e) == ids.CorrelationId); // Filter out others' traces b/c too much data

        var scheme = appConfig.UsesHttps ? Uri.UriSchemeHttps : Uri.UriSchemeHttp;

        var entriesToLog = entries
            .Select(e => new LogEntryDto(
                timestamp: e.Timestamp.UtcDateTime,
                level: (LogLevel)e.Level,
                formattedMessage: e.MessageTemplate.Render(e.Properties),
                properties: SerializeAllProperties(e),
                requestId: GetProperty<string?>(e, LogEventProperties.RequestId),
                httpMethod: GetProperty<string?>(e, LogEventProperties.HttpMethod),
                requestUrl: GetRequestUrl(e, scheme)))
            .ToList();

        if (openTelemetryConfiguration.SendErrorLogs)
        {
            var recordCookie = cookieHandler.GetValue("trc.rec");
            var prod = currentProduct.Product.ToString();
            var activitySource = new ActivitySource(TracingUtils.TraceServiceName + prod);
            using var activity = activitySource.StartActivity(TracingUtils.TraceSpanActivity + prod);
            if (activity != null && recordCookie != null)
            {
                foreach (var entry in entriesToLog.Where(d => d.Level.ToString().Equals("Error")))
                {
                    LogTraceActivity(entry, ids.CorrelationId, activity);
                }
            }
        }
        return entriesToLog;
    }

    private void LogTraceActivity(LogEntryDto entries, string correlationId, Activity activity)
    {
        var jsonObject = JObject.Parse(entries.Properties.ToString());
        activity.SetTag("correlationId", correlationId);
        activity.SetTag("error", entries.Level.ToString().Equals("Error") ? "true" : "false");
        activity.SetTag("timestampUtc", entries.Timestamp.ToUniversalTime().ToString());
        activity.SetTag("messageFormated", entries.FormattedMessage);
        activity.SetTag("data", jsonObject["data"]?.ToString());

        foreach (var property in jsonObject.Properties())
        {
            var key = property.Name;
            var value = property.Value.ToString();

            if (!string.IsNullOrWhiteSpace(key) && !key.Equals("message") && !string.IsNullOrWhiteSpace(value))
            {
                activity.SetTag(key, value);
            }
        }

        activity.Start();
    }

    private static Uri? GetRequestUrl(LogEvent logEvent, string scheme)
    {
        var hostname = GetProperty<string?>(logEvent, LogEventProperties.HttpHostname);

        if (hostname == null)
            return null;

        var path = GetProperty<string?>(logEvent, LogEventProperties.HttpAbsolutePath);
        var query = GetProperty<string?>(logEvent, LogEventProperties.HttpQuery);

        return new Uri($"{scheme}://{hostname}{path}{query}");
    }

    private JRaw SerializeAllProperties(LogEvent logEvent)
    {
        var writer = new StringWriter();
        jsonFormatter.Format(logEvent, writer);

        return new JRaw(writer.ToString());
    }

    private static string? GetCorrelationId(LogEvent logEvent)
        => GetProperty<string?>(logEvent, LogEventProperties.CorrelationId);

#nullable disable
    private static bool IsRecordedTrace(LogEvent logEvent)
        => GetProperty<bool>(logEvent, LogEventProperties.TraceRecorded);

    [return: MaybeNull]
    private static T GetProperty<T>(LogEvent logEvent, string name)
        => logEvent.Properties.TryGetValue(name, out var propValue) ? (T)((ScalarValue)propValue).Value : default;
}
