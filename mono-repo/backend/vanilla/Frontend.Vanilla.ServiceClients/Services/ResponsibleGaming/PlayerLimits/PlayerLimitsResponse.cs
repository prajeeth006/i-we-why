using System.Collections.Generic;

namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerLimits;

internal sealed class PlayerLimitsResponse : IPlayerLimits
{
    public int WaitingPeriodInDays { get; set; }

    public IReadOnlyList<Limit> Limits { get; set; }
}
