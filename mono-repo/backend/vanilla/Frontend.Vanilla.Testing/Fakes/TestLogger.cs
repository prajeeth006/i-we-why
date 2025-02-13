#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using FluentAssertions;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Logging;
using Moq;

namespace Frontend.Vanilla.Testing.Fakes;

/// <summary>
/// Logger that is used to mock <see cref="ILogger{TCategoryName}" />.
/// </summary>
public sealed class TestLogger<T> : ILogger<T>
{
    private readonly List<LoggedEvent> logged = new ();
    private Exception? error;

    /// <summary>Gets logged events.</summary>
    public List<LoggedEvent> Logged => error == null ? logged : throw new Exception("Invalid events logged. See inner exception.", error);

    void ILogger.Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception, string> formatterFunc)
    {
        try
        {
            // Checks that all passed arguments are used in the message format
            if (state == null) throw new Exception("Null state logged.");

            var logValues = (IReadOnlyList<KeyValuePair<string, object?>>)state;
            var actualValueCount = logValues.Count - 1; // -1 b/c of message format
            var passedValues = (object[]?)LogValuesMembers.Values.GetValue(logValues) ?? throw new Exception("Null values.");

            if (passedValues.Length < actualValueCount)
            {
                var formatter = LogValuesMembers.Formatter.GetValue(logValues) ?? throw new Exception("Null formatter.");
                var valueNames = (IEnumerable<string>?)LogValuesMembers.ValueNames.GetValue(formatter) ?? throw new Exception("Null valueNames.");

                throw new Exception($"Missing last {actualValueCount - passedValues.Length} values"
                                    + $" for message format parameters: {valueNames.Skip(passedValues.Length).Dump()}.");
            }

            if (passedValues.Length > actualValueCount)
            {
                throw new Exception($"Last {passedValues.Length - actualValueCount} values passed to the logger aren't used"
                                    + $" in the message format: {passedValues.Skip(actualValueCount).Dump()}.");
            }

            var data = logValues.ToDictionary(); // Throws if invalid value count -> handled above
            var format = (string?)data["{OriginalFormat}"];
            format = (format != "[null]" ? format : null) ?? throw new Exception("Message format can't be null.");
            data.Remove("{OriginalFormat}");

            Logged.Add(new LoggedEvent(exception, logLevel, format, data, logValues.ToString() ?? ""));
        }
        catch (Exception ex)
        {
            error ??= ex; // Store to rethrow it in the test in case somebody swallowed it

            throw;
        }
    }

    bool ILogger.IsEnabled(LogLevel logLevel)
        => true;

    IDisposable ILogger.BeginScope<TState>(TState state)
        => Mock.Of<IDisposable>();

    /// <summary>Verifies that count of logged events is equal to 0.</summary>
    public void VerifyNothingLogged()
        => Logged.Should().BeEmpty();

    private static class LogValuesMembers
    {
        public static readonly FieldInfo Values = GetType("FormattedLogValues").GetRequired<FieldInfo>("_values");
        public static readonly FieldInfo Formatter = GetType("FormattedLogValues").GetRequired<FieldInfo>("_formatter");
        public static readonly PropertyInfo ValueNames = GetType("LogValuesFormatter").GetRequired<PropertyInfo>("ValueNames");

        private static Type GetType(string name)
            => Type.GetType($"Microsoft.Extensions.Logging.{name}, Microsoft.Extensions.Logging.Abstractions")
               ?? Type.GetType($"Microsoft.Extensions.Logging.Internal.{name}, Microsoft.Extensions.Logging.Abstractions")
               ?? throw new Exception($"Unable to find {name}. Was it moved?");
    }
}

/// <summary>Represents a logged event.</summary>
public sealed class LoggedEvent
{
    /// <summary>Creates a new instance.</summary>
    internal LoggedEvent(Exception? exception, LogLevel level, string messageFormat, IEnumerable<KeyValuePair<string, object?>> data, string finalMessage)
    {
        Exception = exception;
        Level = Guard.DefinedEnum(level, nameof(level));
        MessageFormat = Guard.NotWhiteSpace(messageFormat, nameof(messageFormat));
        Data = data.ToDictionary();
        FinalMessage = Guard.NotWhiteSpace(finalMessage, nameof(finalMessage));
    }

    /// <summary>Gets the exception.</summary>
    public Exception? Exception { get; }

    /// <summary>Gets the level.</summary>
    public LogLevel Level { get; }

    /// <summary>Gets the message format template.</summary>
    public string MessageFormat { get; }

    /// <summary>Gets the data.</summary>
    public IReadOnlyDictionary<string, object?> Data { get; }

    /// <summary>
    ///     Gets final formatted message constructed from <see cref="MessageFormat" /> and <see cref="FinalMessage" />.
    ///     This isn't used in production.
    /// </summary>
    public string FinalMessage { get; }

    /// <summary>Verifies this event to have given level, data and null exception.</summary>
    public void Verify(LogLevel level, Dictionary<string, object> data)
    {
        var dataList = new List<(string Key, object? Value)>();

        foreach (var pair in data)
        {
            dataList.Add((pair.Key, pair.Value));
        }

        Verify(level, dataList.ToArray());
    }

    /// <summary>Verifies this event to have given level, data and null exception.</summary>
    public void Verify(LogLevel level, params (string Key, object? Value)[] data)
        => Verify(level, (Exception?)null, data);

    /// <summary>Verifies this event to have given level, exception and data.</summary>
    public void Verify(LogLevel level, Exception? ex = null, params (string Key, object? Value)[] data)
        => Verify(level, e => e == ex, data);

    /// <summary>Verifies this event to have given level, data and exception satisfies given predicate.</summary>
    public void Verify(LogLevel level, Expression<Func<Exception, bool>> exceptionPredicate, params (string Key, object? Value)[] data)
    {
        Level.Should().Be(level);
        Exception.Should().Match(exceptionPredicate);
        var expect = data.ToDictionary(e => e.Key, e => e.Value);
        Data.Should().BeEquivalentTo(expect);
    }
}
