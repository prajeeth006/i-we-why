using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerLimits;

internal interface IPlayerLimitsServiceClient
{
    Task<PlayerLimits> GetPlayerLimitsAsync(ExecutionMode mode);
}

internal class PlayerLimitsServiceClient(IPosApiRestClient restClient) : IPlayerLimitsServiceClient
{
    public async Task<PlayerLimits> GetPlayerLimitsAsync(ExecutionMode mode)
    {
        var request = new PosApiRestRequest(PosApiEndpoint.ResponsibleGaming.LimitsPlayer) { Authenticate = true };
        var response = await restClient.ExecuteAsync<PlayerLimitsResponse>(mode, request);

        return new PlayerLimits
        {
            Limits = response?.Limits.Select(limit => new Limit
            {
                ApprovalDate = limit.ApprovalDate,
                ApprovalNeeded = limit.ApprovalNeeded,
                CurrentLimit = limit.CurrentLimit ?? 0,
                CurrentUnit = limit.CurrentUnit,
                LimitType = limit.LimitType,
                OptedIn = limit.OptedIn,
                RemovalRequested = limit.RemovalRequested,
                RequestedDate = limit.RequestedDate,
                RequestedLimit = limit.RequestedLimit,
                RequestedUnit = limit.RequestedUnit,
                LimitEffectiveDate = limit.LimitEffectiveDate,
            }).ToList(),
            WaitingPeriodInDays = response?.WaitingPeriodInDays ?? -1,
        };
    }
}
