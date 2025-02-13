using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Notification.EdsGroup;

/// <summary>
/// EdsGroupOptInRequest request.
/// </summary>
public sealed class EdsGroupOptInRequest
{
    /// <summary>
    /// Event ID.
    /// </summary>
    [NotNull]
    public string EventId { get; set; }

    /// <summary>
    /// Optin status.
    /// </summary>
    public bool Optin { get; set; }

    /// <summary>
    /// Source.
    /// </summary>
    public string Source { get; set; }
}
