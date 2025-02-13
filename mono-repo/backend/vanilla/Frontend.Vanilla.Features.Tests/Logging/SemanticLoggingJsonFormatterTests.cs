using System;
using System.Collections.Generic;
using System.IO;
using FluentAssertions;
using Frontend.Vanilla.Features.Logging;
using Frontend.Vanilla.Testing.FluentAssertions;
using Serilog.Core;
using Serilog.Events;
using Serilog.Parsing;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Logging;

public sealed class SemanticLoggingJsonFormatterTests
{
    private static void RunTest(Exception ex, IEnumerable<LogEventProperty> props, string expectedInnerJson)
    {
        var timestamp = new DateTimeOffset(2001, 2, 3, 4, 5, 6, 7, TimeSpan.FromMinutes(30));
        var msg = new MessageTemplate("What-is-dead-may-never-die", new MessageTemplateToken[0]);
        var logEvent = new LogEvent(timestamp, LogEventLevel.Error, ex, msg, props);
        var output = new StringWriter();
        var target = SemanticLoggingJsonFormatter.Singleton;

        // Act
        target.Format(logEvent, output);

        output.ToString().Should().EndWith($"{Environment.NewLine}")
            .And.NotContain(" ", "should be as short as possible")
            .And.BeJson(@"{
                    '@timestamp': '2001-02-03T03:35:06.0070000Z',
                    message: 'What-is-dead-may-never-die',
                    level: 'Error',
                    logtype: 'applog',
                    " + expectedInnerJson + @"
                }");
    }

    [Fact]
    public void ShouldFormatCorrectly()
        => RunTest(
            ex: new Exception("Winter-is-coming", new ArgumentException("The-pack-survives")),
            props: new[]
            {
                new LogEventProperty(Constants.SourceContextPropertyName, new ScalarValue("Logging.App")),
                new LogEventProperty("kingdom", new ScalarValue("Winterfell")),
                new LogEventProperty("lord", new ScalarValue("John-Snow")),
                new LogEventProperty(LogEventProperties.EnrichedPrefix + "hero", new ScalarValue("Chuck-Norris")),
                new LogEventProperty(LogEventProperties.EnrichedPrefix + "stats", new StructureValue(new[]
                {
                    new LogEventProperty("level", new ScalarValue(99)),
                    new LogEventProperty("strength", new ScalarValue("max")),
                })),
            },
            expectedInnerJson: @"
                    exception: {
                        class: 'System.Exception',
                        message: 'Winter-is-coming',
                        stack: null,
                        inner: {
                            class: 'System.ArgumentException',
                            message: 'The-pack-survives',
                            stack: null
                        }
                    },
                    hero: 'Chuck-Norris',
                    stats: {
                        level: 99,
                        strength: 'max'
                    },
                    'logger.class': 'Logging.App',
                    'logtype': 'applog',
                    data: {
                        kingdom: 'Winterfell',
                        lord: 'John-Snow'
                    }");

    [Fact]
    public void ShouldSkipSomeParts_IfNoExceptionOrDataProperties()
        => RunTest(
            ex: null,
            props: Array.Empty<LogEventProperty>(),
            expectedInnerJson: "");
}
