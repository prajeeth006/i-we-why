using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Features.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Serilog.Core;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Logging;

public sealed class LoggingOptionsSetupTests
{
    private readonly IConfigureOptions<LoggingOptions> target;
    private readonly Mock<ISemanticLoggingConfiguration> semanticLoggingConfig;
    private readonly IEnumerable<ILogEventEnricher> enrichers;

    public LoggingOptionsSetupTests()
    {
        semanticLoggingConfig = new Mock<ISemanticLoggingConfiguration>();
        enrichers = new List<ILogEventEnricher>();
        target = new LoggingOptionsSetup(semanticLoggingConfig.Object, enrichers);
    }

    [Fact]
    public void ShouldConfigureCorrectly()
    {
        semanticLoggingConfig.SetupGet(o => o.FileSinks).Returns(new List<SemanticLoggingFileSink>());
        var loggingOptions = new LoggingOptions();

        target.Configure(loggingOptions);
        loggingOptions.Logger.Should().NotBeNull();
    }
}
