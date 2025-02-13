using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Features.Logging;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Serilog.Core;
using Serilog.Events;
using Serilog.Formatting;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Logging;

public class SemanticLoggingConfiguratorTests : IDisposable
{
    private SemanticLoggingConfigurator target;
    private Mock<ISemanticLoggingConfiguration> configManager;
    private Mock<ITextFormatter> formatter;

    private List<string> tempFiles;
    private Exception testEx;

    public SemanticLoggingConfiguratorTests()
    {
        configManager = new Mock<ISemanticLoggingConfiguration>();
        formatter = new Mock<ITextFormatter>();
        target = new SemanticLoggingConfigurator(configManager.Object, formatter.Object);

        tempFiles = new List<string>();
        testEx = new Exception("Oups");
    }

    [Fact]
    public void ShouldConfigureBasedOnWebConfig()
    {
        var enricher = new Mock<ILogEventEnricher>();
        var testStartTime = DateTime.UtcNow;
        tempFiles.Add(TempFile.Get(createFile: false));
        tempFiles.Add(TempFile.Get(createFile: false));
        configManager.Setup(s => s.FileSinks).Returns(new[]
        {
            MockFileSink(enabled: true, tempFiles[0]),
            MockFileSink(enabled: false, tempFiles[1]),
        });
        formatter.SetupWithAnyArgs(f => f.Format(null, null))
            .Callback((LogEvent e, TextWriter w) => w.Write("Hello world"));
        enricher.SetupWithAnyArgs(e => e.Enrich(null, null))
            .Callback((LogEvent e, ILogEventPropertyFactory f) => e.SetProperty("enriched", "rich"));

        // Act
        using (var log = target.BuildLog(out var injectEnrichers))
        {
            injectEnrichers(new[] { enricher.Object });
            log.Warning(testEx, "Hello {name}", "Chuck Norris");
        }

        File.ReadAllText(tempFiles[0]).Should().Be("Hello world");
        File.Exists(tempFiles[1]).Should().BeFalse();

        var logged = (LogEvent)formatter.Invocations.Single().Arguments.First();
        logged.Exception.Should().BeSameAs(testEx);
        logged.Level.Should().Be(LogEventLevel.Warning);
        logged.Timestamp.Should().BeAfter(testStartTime).And.BeBefore(DateTime.UtcNow);
        logged.MessageTemplate.ToString().Should().Be("Hello {name}");
        logged.VerifyProperties(
            ("name", "Chuck Norris"),
            ("enriched", "rich"));
    }

    private static SemanticLoggingFileSink MockFileSink(bool enabled, string path)
        => new ()
        {
            Enabled = enabled,
            Type = SemanticLoggingFileSinkType.App,
            Path = path,
            FileSizeLimitBytes = 524288000,
            Shared = true,
            RollOnFileSizeLimit = true,
            RetainedFileCountLimit = 1,
            BufferSize = 1,
        };

    public void Dispose() => tempFiles.Each(TempFile.DeleteIfExists);
}
