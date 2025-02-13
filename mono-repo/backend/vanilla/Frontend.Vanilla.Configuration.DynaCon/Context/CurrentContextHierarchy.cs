using System;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;

namespace Frontend.Vanilla.Configuration.DynaCon.Context;

/// <summary>
/// Holds shared (for all tenants) instance of variation context hierarchy object b/c it's (mostly) unrelated to a changeset.
/// </summary>
internal interface ICurrentContextHierarchy
{
    VariationContextHierarchy Value { get; }
}

internal interface ICurrentContextHierarchyManager : ICurrentContextHierarchy
{
    void Set(VariationContextHierarchy value);
}

internal sealed class CurrentContextHierarchy(IFallbackFile<VariationContextHierarchy> fallbackFile) : ICurrentContextHierarchyManager
{
    private volatile VariationContextHierarchy? current;

    public VariationContextHierarchy Value
        => current ?? throw new InvalidOperationException("Value wasn't initialized yet.");

    public void Set(VariationContextHierarchy value)
    {
        current = value;

        if (value.Source == ConfigurationSource.Service)
            fallbackFile.Handler?.Write(value);
    }
}
