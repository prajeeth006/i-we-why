using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Frontend.Vanilla.Features.Logging;

internal static class LogEventProperties
{
    public const string Message = "{OriginalFormat}";
    public const string EnrichedPrefix = "enriched.";

    private const string HttpPrefix = EnrichedPrefix + "http.";
    public const string HttpHostname = HttpPrefix + "hostname";
    public const string HttpAbsolutePath = HttpPrefix + "absolutePath";
    public const string HttpQuery = HttpPrefix + "query";
    public const string HttpMethod = HttpPrefix + "method";
    public const string HttpReferrer = HttpPrefix + "referrer";
    public const string HttpUserAgent = HttpPrefix + "userAgent";
    public const string HttpClientIP = HttpPrefix + "clientIP";

    public const string Domain = EnrichedPrefix + "domain";
    private const string UserPrefix = EnrichedPrefix + "user.";
    public const string UserName = UserPrefix + "name";
    public const string UserIsAuthenticated = UserPrefix + "isAuthenticated";
    public const string UserWorkflowType = UserPrefix + "workflowType";

    public const string EvasionDomain = EnrichedPrefix + "evasionDomain";
    public const string NativeApp = EnrichedPrefix + "nativeApp";
    public const string CorrelationId = EnrichedPrefix + "correlationId";
    public const string RequestId = EnrichedPrefix + "requestId";
    public const string TraceRecorded = EnrichedPrefix + "traceRecorded";

    private const string ThreadPrefix = EnrichedPrefix + "thread.";
    public const string ThreadId = ThreadPrefix + "id";
    public const string ThreadCulture = ThreadPrefix + "culture";

    private const string TerminalPrefix = EnrichedPrefix + "terminal.";
    public const string ShopId = TerminalPrefix + "shopId";
    public const string TerminalId = TerminalPrefix + "id";
}

internal static class LogJsonProperties
{
    public const string Source = "logger.class";
    public const string Timestamp = "@timestamp";
    public const string MessageTemplate = "message";
    public const string Level = "level";
    public const string Exception = "exception";
    public const string Data = "data";
    public const string LogType = "logtype";

    public static readonly IReadOnlyList<string> EnrichedProperties = typeof(LogEventProperties)
        .GetFields(BindingFlags.Static | BindingFlags.Public)
        .Select(f => (string)f.GetValue(null)!)
        .Where(p => p.StartsWith(LogEventProperties.EnrichedPrefix) && p != LogEventProperties.EnrichedPrefix)
        .Select(p => p.Substring(LogEventProperties.EnrichedPrefix.Length))
        .ToArray();
}
