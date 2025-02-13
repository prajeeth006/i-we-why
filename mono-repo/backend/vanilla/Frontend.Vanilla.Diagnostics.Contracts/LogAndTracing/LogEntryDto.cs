using System;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Diagnostics.Contracts.LogAndTracing;

public sealed class LogEntryDto(DateTime timestamp, LogLevel level, string formattedMessage, JToken properties, string? requestId, string? httpMethod, Uri? requestUrl)
{
    public DateTime Timestamp { get; } = timestamp;
    public LogLevel Level { get; } = level;
    public string FormattedMessage { get; } = formattedMessage;
    public JToken Properties { get; } = properties;
    public string? RequestId { get; } = requestId;
    public string? HttpMethod { get; } = httpMethod;
    public Uri? RequestUrl { get; } = requestUrl;
}

#pragma warning disable SA1602 // Enumeration items should be documented
public enum LogLevel
{
    Verbose = 0,
    Debug = 1,
    Information = 2,
    Warning = 3,
    Error = 4,
    Fatal = 5,
}
