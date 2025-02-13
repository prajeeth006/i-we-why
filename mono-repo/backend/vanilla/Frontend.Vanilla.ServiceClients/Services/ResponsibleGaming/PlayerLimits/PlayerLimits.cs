using System;
using System.Collections.Generic;

namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerLimits;

internal sealed class Limit : ILimit
{
    public DateTime? ApprovalDate { get; set; }

    public bool ApprovalNeeded { get; set; }

    public decimal? CurrentLimit { get; set; }

    public string CurrentUnit { get; set; }

    public DateTime? LimitEffectiveDate { get; set; }

    public string LimitType { get; set; }

    public bool OptedIn { get; set; }

    public bool RemovalRequested { get; set; }

    public DateTime? RequestedDate { get; set; }

    public decimal? RequestedLimit { get; set; }

    public string RequestedUnit { get; set; }

    public Limit()
    {
        LimitType = "Unknown";
        CurrentLimit = 0;
    }
}

internal sealed class PlayerLimits : IPlayerLimits
{
    public int WaitingPeriodInDays { get; set; }

    public IReadOnlyList<Limit> Limits { get; set; }

    public PlayerLimits()
    {
        WaitingPeriodInDays = 0;
        Limits = new List<Limit>();
    }
}
