using System;
using System.Collections.Generic;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.IO;

namespace Frontend.Vanilla.Configuration.DynaCon.Context;

/// <summary>
/// Defines specific handling of file with a fallback context hierarchy.
/// </summary>
internal sealed class ContextHierarchyFallbackFileHandler(DynaConEngineSettings settings) : IFallbackFileDataHandler<VariationContextHierarchy>
{
    public RootedPath? Path => settings.ContextHierarchyFallbackFile;
    public IReadOnlyList<DynaConParameter> Parameters => settings.TenantBlueprint.Parameters; // Same file for all tenants

    public VariationContextHierarchy Deserialize(FallbackDto dto)
        => new VariationContextHierarchy(
            dto.ContextHierarchy?.Hierarchy ?? throw new Exception("Missing deserialized ContextHierarchy."),
            ConfigurationSource.FallbackFile);

    public FallbackDto Serialize(VariationContextHierarchy contextHierarchy)
        => new FallbackDto { ContextHierarchy = contextHierarchy };
}
