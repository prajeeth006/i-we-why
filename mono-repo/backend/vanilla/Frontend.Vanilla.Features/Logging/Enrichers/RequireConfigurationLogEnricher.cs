using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Core.Ioc;
using Serilog.Core;
using Serilog.Events;

namespace Frontend.Vanilla.Features.Logging.Enrichers;

/// <summary>
/// Requires config to be resolved for current context before inner enricher is executed because it uses it.
/// Otherwise there can be a stack-overflow: config failed to load -> error being logged -> enricher get config.
/// </summary>
internal sealed class RequireConfigurationLogEnricher(ILogEventEnricher inner, ICurrentContextAccessor currentContextAccessor) : ILogEventEnricher
{
    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
    {
        if (currentContextAccessor.Items.ContainsKey(CachedChangesetResolver.ItemsKey))
            inner.Enrich(logEvent, propertyFactory);
    }
}
