using Frontend.Vanilla.Features.Logging.Enrichers;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Serilog.Core;
using Serilog.Events;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Logging.Enrichers;

public class DependencyInjectionLogEnricherTests
{
    private DependencyInjectionLogEnricher target;
    private Mock<ILogEventEnricher> enricher1;
    private Mock<ILogEventEnricher> enricher2;
    private LogEvent logEvent;
    private ILogEventPropertyFactory propertyFactory;

    public DependencyInjectionLogEnricherTests()
    {
        target = new DependencyInjectionLogEnricher();
        enricher1 = new Mock<ILogEventEnricher>();
        enricher2 = new Mock<ILogEventEnricher>();
        logEvent = TestLogEvent.Get();
        propertyFactory = Mock.Of<ILogEventPropertyFactory>();
    }

    [Fact]
    public void ShouldDoNothing_IfNoEnrichers()
        => target.Enrich(logEvent, propertyFactory); // Act

    [Fact]
    public void ShouldCallAllEnrichers_IfInjected()
    {
        target.InjectEnrichers(new[] { enricher1.Object, enricher2.Object });

        target.Enrich(logEvent, propertyFactory); // Act}

        enricher1.Verify(e => e.Enrich(logEvent, propertyFactory));
        enricher2.Verify(e => e.Enrich(logEvent, propertyFactory));
    }
}
