using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.Offline;

internal interface IOfflineConfiguration
{
    [Required]
    IDslExpression<bool> IsOfflineOverlayEnabled { get; }

    [Required]
    int OfflineRequestsThreshold { get; }
}

internal sealed class OfflineConfiguration(IDslExpression<bool> isOfflineOverlayEnabled, int offlineRequestsThreshold) : IOfflineConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.Offline";

    public IDslExpression<bool> IsOfflineOverlayEnabled { get; set; } = isOfflineOverlayEnabled;
    public int OfflineRequestsThreshold { get; set; } = offlineRequestsThreshold;
}
