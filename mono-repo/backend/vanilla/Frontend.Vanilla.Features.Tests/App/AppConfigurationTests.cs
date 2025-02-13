using System.IO.Compression;
using FluentAssertions;
using Frontend.Vanilla.Features.App;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.App;

public class AppConfigurationTests
{
    [Fact]
    public void IsUnderMaintenance_ShouldHaveDefaultValue()
        => new AppConfiguration(false, new CompressionLevelOptions(CompressionLevel.Fastest, CompressionLevel.Optimal), false, []).UsesHttps.Should()
            .Be(false);
}
