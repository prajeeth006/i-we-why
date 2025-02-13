using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using Serilog.Core;
using Serilog.Events;
using Serilog.Formatting;
using Serilog.Formatting.Json;

namespace Frontend.Vanilla.Features.Logging;

/// <summary>
/// Converts log event to raw semantic JSON.
/// </summary>
internal sealed class SemanticLoggingJsonFormatter : ITextFormatter
{
    public static readonly ITextFormatter Singleton = new SemanticLoggingJsonFormatter();
    private SemanticLoggingJsonFormatter() { }

    private static readonly JsonValueFormatter ValueFormatter = new JsonValueFormatter(typeTagName: "$type");

    public void Format(LogEvent logEvent, TextWriter output)
    {
        var json = new SimpleJsonWriter(output, ValueFormatter);

        json.StartObject();
        json.WriteProperty(LogJsonProperties.Timestamp, logEvent.Timestamp.UtcDateTime.ToString("O"));
        json.WriteProperty(LogJsonProperties.MessageTemplate, logEvent.MessageTemplate.Text);
        json.WriteProperty(LogJsonProperties.Level, logEvent.Level.ToString());
        json.WriteProperty(LogJsonProperties.LogType, logEvent.MessageTemplate.Text != SemanticLoggingMessageTemplate.Health ? "applog" : "healthlog");

        if (logEvent.Exception != null)
        {
            json.WritePropertyName(LogJsonProperties.Exception);
            FormatException(logEvent.Exception, json);
        }

        var dataProperties = new List<KeyValuePair<string, LogEventPropertyValue>>(logEvent.Properties.Count);

        foreach (var property in logEvent.Properties)
        {
            if (property.Key.StartsWith(LogEventProperties.EnrichedPrefix))
                json.WriteProperty(property.Key.Substring(LogEventProperties.EnrichedPrefix.Length), property.Value);
            else if (property.Key == Constants.SourceContextPropertyName)
                json.WriteProperty(LogJsonProperties.Source, property.Value);
            else
                dataProperties.Add(property);
        }

        if (dataProperties.Count > 0)
        {
            json.WritePropertyName(LogJsonProperties.Data);
            json.StartObject();
            foreach (var property in dataProperties)
                json.WriteProperty(property.Key, property.Value);
            json.EndObject();
        }

        json.EndObject();
        output.WriteLine();
    }

    private static void FormatException(Exception exception, SimpleJsonWriter json)
    {
        json.StartObject();
        json.WriteProperty("class", exception.GetType().FullName);
        json.WriteProperty("message", exception.Message);
        json.WriteProperty("stack", exception.StackTrace);

        if (exception.Data.Count > 0)
        {
            json.WritePropertyName("data");
            json.StartObject();
            foreach (DictionaryEntry entry in exception.Data)
                json.WriteProperty(entry.Key.ToString()!, entry.Value?.ToString());
            json.EndObject();
        }

        if (exception.InnerException != null)
        {
            json.WritePropertyName("inner");
            FormatException(exception.InnerException, json);
        }

        json.EndObject();
    }
}
