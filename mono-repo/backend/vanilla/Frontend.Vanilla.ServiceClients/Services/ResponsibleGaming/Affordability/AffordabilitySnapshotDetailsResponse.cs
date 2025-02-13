namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.Affordability;

/// <summary>
/// Response for Affordability/SnapshotDetailsV2 endpoint.
/// <see href="https://test.api.bwin.com/v3/#responsibe-gaming-player-affordability-snapshot-details-v2"/>.
/// </summary>
internal class AffordabilitySnapshotDetailsResponse
{
    /// <summary>
    /// Affordability Status with LEVEL1 .. LEVEL6 or OTHER values.
    /// </summary>
    public string AffordabilityStatus { get; set; } = string.Empty;

    /// <summary>
    /// Employment group.
    /// </summary>
    public string EmploymentGroup { get; set; } = string.Empty;
}
