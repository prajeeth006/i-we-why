using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Configuration.DynaCon.Context;

/// <summary>
/// Resolves current variation context value using registered <see cref="IDynaConVariationContextProvider" />-s.
/// </summary>
internal interface IDynamicVariationContextResolver
{
    IReadOnlyCollection<TrimmedRequiredString> ProviderNames { get; }
    TrimmedRequiredString Resolve(TrimmedRequiredString name, IValidChangeset changeset);
}

internal sealed class DynamicVariationContextResolver : IDynamicVariationContextResolver
{
    private readonly ReadOnlyDictionary<TrimmedRequiredString, IDynaConVariationContextProvider> providers;
    private readonly ICurrentContextAccessor currentContextAccessor;

    public DynamicVariationContextResolver(IEnumerable<IDynaConVariationContextProvider> providers, ICurrentContextAccessor currentContextAccessor)
    {
        this.providers = providers.ToDictionary(p => p.Name, RequiredStringComparer.OrdinalIgnoreCase.AsTrimmed()).AsReadOnly();
        this.currentContextAccessor = currentContextAccessor;
    }

    public IReadOnlyCollection<TrimmedRequiredString> ProviderNames => providers.Keys;

    public TrimmedRequiredString Resolve(TrimmedRequiredString name, IValidChangeset changeset)
        => currentContextAccessor.Items.GetOrAddFromFactory("Van:Config:Context:" + name.Value.ToLowerInvariant(), _ => ResolveFresh(name, changeset));

    private TrimmedRequiredString ResolveFresh(TrimmedRequiredString name, IValidChangeset changeset)
    {
        var provider = providers.GetValue(name)
                       // Just in case but shouldn't happen b/c already sanitized in InputCleanUpDecorator
                       ?? throw new Exception(
                           $"There is no registered {typeof(IDynaConVariationContextProvider)} with Name '{name}' to resolve particular variation context property.");

        var definedValues = changeset.DefinedContextValues.GetValue(name);

        if (definedValues.IsNullOrEmpty())
            throw new Exception($"There are no defined values for configuration variation context property '{name}' but configuration with this property exists."
                                + $" This most likely indicates race condition of fetching the changeset vs. variation hierarchy. Associated provider is {provider}.");

        // Actual resolution
        var resultValue = provider.GetCurrentValue(definedValues);

        return resultValue != null && definedValues.Contains(resultValue)
            ? resultValue
            : throw new Exception($"Provider {provider} for configuration variation context property '{name}' returned {resultValue.Dump()}"
                                  + $" which is not in the list of defined values in DynaCon. Defines values: {definedValues.Dump()}.");
    }
}
