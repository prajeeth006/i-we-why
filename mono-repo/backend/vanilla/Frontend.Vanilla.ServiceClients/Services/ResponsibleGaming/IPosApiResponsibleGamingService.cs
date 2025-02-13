using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.Affordability;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.ArcPlayBreaks;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.DepositLimits;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerArea;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerLimits;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.RealityCheck;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.ScreenTime;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.SelfExclusion;

namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;

/// <summary>
/// Represents ResponsibleGaming.svc PosAPI service.
/// </summary>
public interface IPosApiResponsibleGamingService
{
    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IPlayBreakServiceClient), nameof(IPlayBreakServiceClient.GetAsync))]
    Task<ArcPlayBreakResponse> GetPlayBreakStatus(ExecutionMode mode, bool cached = true);
}

internal interface IPosApiResponsibleGamingServiceInternal : IPosApiResponsibleGamingService
{
    [DelegateTo(typeof(IRealityCheckServiceClient), nameof(IRealityCheckServiceClient.RcpuStatusAsync))]
    Task<RcpuStatusResponse> RcpuStatusAsync(CancellationToken cancellationToken);

    [DelegateTo(typeof(IRealityCheckServiceClient), nameof(IRealityCheckServiceClient.RcpuContinueAsync))]
    Task RcpuContinueAsync(CancellationToken cancellationToken);

    [DelegateTo(typeof(IRealityCheckServiceClient), nameof(IRealityCheckServiceClient.RcpuQuitAsync))]
    Task RcpuQuitAsync(CancellationToken cancellationToken);

    [DelegateTo(typeof(IPlayerLimitsServiceClient), nameof(IPlayerLimitsServiceClient.GetPlayerLimitsAsync))]
    Task<PlayerLimits.PlayerLimits> GetPlayerLimitsAsync(CancellationToken cancellationToken);

    [DelegateTo(typeof(IAffordabilityServiceClient), nameof(IAffordabilityServiceClient.GetAffordabilitySnapshotDetailsAsync))]
    Task<AffordabilitySnapshotDetailsResponse> GetAffordabilitySnapshotDetailsAsync(CancellationToken cancellationToken);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(ISelfExclusionServiceClient), nameof(ISelfExclusionServiceClient.GetSelfExclusionDetailsAsync))]
    Task<SelfExclusionDetails> GetSelfExclusionDetailsAsync(ExecutionMode mode);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IDepositLimitsServiceClient), nameof(IDepositLimitsServiceClient.GetCachedAsync))]
    Task<IReadOnlyList<DepositLimit>> GetDepositLimitsAsync(ExecutionMode mode);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IPlayBreakServiceClient), nameof(IPlayBreakServiceClient.AcknowledgePlayBreakAction))]
    Task<ArcPlayBreakActionResponse> AcknowledgePlayBreakAction(ArcPlayBreakActionRequest request, ExecutionMode mode);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IScreenTimeServiceClient), nameof(IScreenTimeServiceClient.SaveScreenTimeAsync))]
    Task SaveScreenTimeAsync(ScreenTimeSaveRequest screenTimeSaveRequest, ExecutionMode mode);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IPlayerAreaServiceClient), nameof(IPlayerAreaServiceClient.SetPlayerAreaAsync))]
    Task SetPlayerAreaAsync(SetPlayerAreaRequest setPlayerAreaRequest, ExecutionMode mode);
}
