namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.ArcPlayBreaks;

/// <summary>
/// The ArcPlayBreakActionRequest is sent when the player sets, rejects to set a break duration and break start.
/// </summary>
/// <see href="http://qa2.api.bwin.com/v3/#responsibe-gaming-acknowledgeplaybreakaction"/>
public class ArcPlayBreakActionRequest
{
    /// <summary>
    /// The CTA action name taken in the play break dialog.
    /// </summary>
    public string ActionName { get; set; }

    /// <summary>
    /// The play break duration time chosen by the player.
    /// </summary>
    public long PlayBreakDuration { get; set; }

    /// <summary>
    /// The play break activation after X minutes value chosen by the player.
    /// </summary>
    public int AfterXMinutes { get; set; }

    /// <summary>
    /// Event id received by Frontend via RTMS.
    /// </summary>
    public string CstEventId { get; set; }
}
