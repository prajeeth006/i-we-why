using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerArea;

/// <summary>
/// Contains infomation to save the Screen Time information.
/// </summary>
public sealed class SetPlayerAreaRequest
{
    /// <summary>Gets new area.</summary>
    public string NewArea { get; set; }

    /// <summary>Gets old area.</summary>
    public string OldArea { get; set; }

    /// <summary>Gets date and time of event.</summary>
    public UtcDateTime EventTime { get; set; }
}
