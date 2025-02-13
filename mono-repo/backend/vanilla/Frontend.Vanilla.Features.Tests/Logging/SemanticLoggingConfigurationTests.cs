using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Features.Logging;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Logging;

public sealed class SemanticLoggingConfigurationTests
{
    private readonly ISemanticLoggingConfiguration target;
    private readonly SemanticLoggingFileSink fileSink;

    public SemanticLoggingConfigurationTests()
    {
        fileSink = new SemanticLoggingFileSink { Enabled = true, Path = "path", Type = SemanticLoggingFileSinkType.App };
        target = new SemanticLoggingConfiguration(fileSink);
    }

    [Fact]
    public void ShouldInit()
    {
        target.SerializeToString().Should()
            .BeEquivalentTo(
                "{\"Enabled\":true,\"Type\":\"app\",\"Path\":\"path\",\"RollOnFileSizeLimit\":false,\"FileSizeLimitBytes\":0,\"RetainedFileCountLimit\":0,\"BufferSize\":0,\"Shared\":false}");
        target.FileSinks.Should().BeEquivalentTo(new List<SemanticLoggingFileSink> { fileSink });
    }
}
