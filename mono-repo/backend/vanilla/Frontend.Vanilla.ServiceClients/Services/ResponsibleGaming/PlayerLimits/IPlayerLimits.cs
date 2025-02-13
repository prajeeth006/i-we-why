using System;
using System.Collections.Generic;

namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerLimits;

internal interface ILimit
{
    DateTime? ApprovalDate { get; set; }

    bool ApprovalNeeded { get; set; }

    decimal? CurrentLimit { get; set; }

    string CurrentUnit { get; set; }

    DateTime? LimitEffectiveDate { get; set; }

    string LimitType { get; set; }

    bool OptedIn { get; set; }

    bool RemovalRequested { get; set; }

    DateTime? RequestedDate { get; set; }

    decimal? RequestedLimit { get; set; }

    string RequestedUnit { get; set; }
}

internal interface IPlayerLimits
{
    int WaitingPeriodInDays { get; set; }

    IReadOnlyList<Limit> Limits { get; set; }
}
