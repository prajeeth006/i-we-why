using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Configuration.DynaCon.Context;

/// <summary>
/// Extracted DynaCon variation context parameters which are constant for the app.
/// </summary>
internal sealed class StaticVariationContext : ReadOnlyDictionary<TrimmedRequiredString, TrimmedRequiredString>
{
    public StaticVariationContext(params (string Name, string Value)[] properties)
        : base(properties.ToDictionary(
            p => p.Name.ToLowerInvariant().AsTrimmedRequired(),
            p => p.Value.ToLowerInvariant().AsTrimmedRequired(),
            RequiredStringComparer.OrdinalIgnoreCase.AsTrimmed()))
        => Guard.Requires(properties.All(p => !p.Name.StartsWith(DynaConParameter.ContextPrefix, StringComparison.OrdinalIgnoreCase)),
            nameof(properties),
            "Context prefix isn't allowed.");
}

internal sealed class StaticVariationContextFactory(TenantSettings tenantSettings, IEnumerable<IDynaConVariationContextProvider> dynamicContextProviders)
    : LambdaFactory<StaticVariationContext>(() =>
    {
        var props = tenantSettings.Parameters
            .Where(p => p.Name.StartsWith(DynaConParameter.ContextPrefix, StringComparison.OrdinalIgnoreCase))
            .Select(p => (p.Name.Substring(DynaConParameter.ContextPrefix.Length), p.Value));

        var staticContext = new StaticVariationContext(props.ToArray());

        foreach (var provider in dynamicContextProviders.Where(p => staticContext.ContainsKey(p.Name)))
            throw new Exception($"There can't be {provider} registered as IDynaConVariationContextProvider with Name '{provider.Name}'"
                                + $" because particular variation context property is configured as constant for this app in its context: {staticContext.Keys.Dump()}.");

        return staticContext;
    }) { }
