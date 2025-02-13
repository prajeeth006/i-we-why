using System.Collections.Generic;

namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.Affordability;

/// <summary>
/// Request for the Affordability/SnapshotDetailsV2 endpoint.
/// <see href="https://test.api.bwin.com/v3/#responsibe-gaming-player-affordability-snapshot-details-v2"/>.
/// </summary>
public class AffordabilitySnapshotDetailsRequest
{
    /// <summary>
    /// DNA ID.
    /// </summary>
    public string DnaId { get; set; }

    /// <summary>
    /// Additional Params (e.g. limit types).
    /// </summary>
    public ICollection<IReadOnlyDictionary<string, string>> AdditionalParams { get; set; }
}
