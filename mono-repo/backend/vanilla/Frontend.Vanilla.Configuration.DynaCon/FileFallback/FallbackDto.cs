using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Core.Configuration;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Configuration.DynaCon.FileFallback;

/// <summary>
/// Contents of fallback file for <see cref="IValidChangeset" /> and <see cref="VariationHierarchyResponse" />.
/// </summary>
internal sealed class FallbackDto
{
    [JsonProperty(Order = 1)] // Keep at the beginning to make it easier to diagnose
    public string? AppIdentifier { get; set; }

    [JsonProperty(Order = 2)]
    public HashSet<DynaConParameter>? Parameters { get; set; }

    [JsonProperty(Order = 3, NullValueHandling = NullValueHandling.Ignore)] // Ignored if only context hierarchy stored
    public ConfigurationResponse? Changeset { get; set; }

    [JsonProperty(Order = 4)]
    public VariationHierarchyResponse? ContextHierarchy { get; set; }
}
