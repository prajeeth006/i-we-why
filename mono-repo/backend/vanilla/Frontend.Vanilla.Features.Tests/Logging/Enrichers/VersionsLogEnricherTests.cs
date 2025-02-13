using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Features.Logging.Enrichers;
using Frontend.Vanilla.Testing.Fakes;
using Serilog.Core;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Logging.Enrichers;

public sealed class VersionsLogEnricherTests
{
    private ILogEventEnricher target;

    public VersionsLogEnricherTests()
    {
        target = new VersionsLogEnricher(new VanillaVersion(1, 2, 3, 4, "hash"));
    }

    [Fact]
    public void ShouldAddVanillaVersion()
    {
        var logEvent = TestLogEvent.Get();

        // Act
        target.Enrich(logEvent, null);

        logEvent.VerifyProperties((VersionsLogEnricher.VersionPropertyName, "1.2.3.4-hash"));
    }
}
