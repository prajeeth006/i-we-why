using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;
using Serilog.Core;
using Serilog.Events;

namespace Frontend.Vanilla.Features.Logging.Enrichers;

internal sealed class DependencyInjectionLogEnricher : ILogEventEnricher
{
    private IReadOnlyList<ILogEventEnricher> enrichers = Array.Empty<ILogEventEnricher>();

    public void InjectEnrichers([NotNull, ItemNotNull] IEnumerable<ILogEventEnricher> enrichers)
        => this.enrichers = Guard.NotNullItems(enrichers?.ToArray(), nameof(enrichers));

    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
    {
        foreach (var enricher in enrichers)
            enricher.Enrich(logEvent, propertyFactory);
    }
}
