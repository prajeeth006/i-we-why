using System;
using System.Collections.Concurrent;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Features.Logging.Enrichers;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Serilog.Core;
using Serilog.Events;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Logging.Enrichers;

public class RequireConfigurationLogEnricherTests
{
    private ILogEventEnricher target;
    private Mock<ILogEventEnricher> inner;
    private ICurrentContextAccessor currentContextAccessor;

    private LogEvent logEvent;
    private ILogEventPropertyFactory propertyFactory;

    public RequireConfigurationLogEnricherTests()
    {
        inner = new Mock<ILogEventEnricher>();
        currentContextAccessor = Mock.Of<ICurrentContextAccessor>(a => a.Items == new ConcurrentDictionary<object, Lazy<object>>());
        target = new RequireConfigurationLogEnricher(inner.Object, currentContextAccessor);

        logEvent = TestLogEvent.Get();
        propertyFactory = Mock.Of<ILogEventPropertyFactory>();
    }

    [Fact]
    public void ShouldCallInner_IfConfigExists()
    {
        currentContextAccessor.Items.GetOrAdd(CachedChangesetResolver.ItemsKey, new Lazy<object>());

        // Act
        target.Enrich(logEvent, propertyFactory);

        inner.Verify(i => i.Enrich(logEvent, propertyFactory));
    }

    [Fact]
    public void ShouldNotCallInner_IfNoConfig()
    {
        // Act
        target.Enrich(logEvent, propertyFactory);

        inner.VerifyWithAnyArgs(i => i.Enrich(null, null), Times.Never);
    }
}
