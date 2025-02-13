using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Core.Utils;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Configuration.DynaCon.Context;

internal sealed class VariationContextHierarchy : VariationHierarchyResponse
{
    [JsonIgnore]
    public ConfigurationSource Source { get; }

    public VariationContextHierarchy(IReadOnlyDictionary<string, IReadOnlyDictionary<string, string>> hierarchy, ConfigurationSource source)
        : base(hierarchy)
        => Source = Guard.Requires(source,
            s => s == ConfigurationSource.Service || s == ConfigurationSource.FallbackFile,
            nameof(source),
            "Must be Service or FallbackFile.");
}
