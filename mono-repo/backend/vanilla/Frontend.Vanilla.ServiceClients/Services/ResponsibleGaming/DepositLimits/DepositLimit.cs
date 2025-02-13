using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.DepositLimits;

public sealed class DepositLimit(decimal? currentLimit = null, string type = null, bool limitSet = false)
{
    public decimal? CurrentLimit { get; } = currentLimit;
    public string Type { get; } = type;
    public bool LimitSet { get; } = limitSet;
}

internal sealed class DepositLimitResponse : IPosApiResponse<IReadOnlyList<DepositLimit>>
{
    public IReadOnlyList<DepositLimit> Limits { get; set; }
    public IReadOnlyList<DepositLimit> GetData() => Limits.NullToEmpty();
}
