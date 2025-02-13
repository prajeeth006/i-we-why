using System;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.Reporting.PartialReporters;

/// <summary>
/// Fully resolves dynamic variation context for current request and reports it.
/// </summary>
internal sealed class VariationContextReporter(StaticVariationContext staticContext, IDynamicVariationContextResolver dynamicContextResolver)
    : SyncPartialConfigurationReporter
{
    public override void Fill(ConfigurationReport report, IConfigurationSnapshot snapshot)
    {
        var context = staticContext.ToDictionary(RequiredStringComparer.OrdinalIgnoreCase);
        report.VariationContextForThisRequest = context;

        foreach (var name in dynamicContextResolver.ProviderNames)
            try
            {
                var value = dynamicContextResolver.Resolve(name, snapshot.ActiveChangeset);
                context.Add(name, value);
            }
            catch (Exception ex)
            {
                context.Add(name, new EvaluationException(ex).ToString());
            }
    }

    public sealed class EvaluationException(Exception innerEx) : Exception(
        "Failed resolving the value using corresponding provider (see inner exception). This will most likely fail the request for users with same conditions!!!",
        innerEx)
    {
        public bool Passed => false; // Renders as red in /health/config
    }
}
