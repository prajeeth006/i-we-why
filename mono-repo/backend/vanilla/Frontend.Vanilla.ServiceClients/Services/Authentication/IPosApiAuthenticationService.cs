#nullable enable

using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Authentication.AddWorkflowData;
using Frontend.Vanilla.ServiceClients.Services.Authentication.ArcSessionSummary;
using Frontend.Vanilla.ServiceClients.Services.Authentication.CurrentSessions;
using Frontend.Vanilla.ServiceClients.Services.Authentication.LastSessions;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Logout;
using Frontend.Vanilla.ServiceClients.Services.Authentication.OTP;
using Frontend.Vanilla.ServiceClients.Services.Authentication.PendingActions;
using Frontend.Vanilla.ServiceClients.Services.Authentication.SessionLimits;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Authentication;

/// <summary>
/// Represents Authentication.svc PosAPI service.
/// </summary>
public interface IPosApiAuthenticationService
{
    /// <summary>Valid both for authenticated and anonymous user.</summary>
    [DelegateTo(typeof(IClaimsServiceClient), nameof(IClaimsServiceClient.ReloadAsync))]
    void RefreshClaims();

    /// <summary>Valid both for authenticated and anonymous user.</summary>
    [DelegateTo(typeof(IClaimsServiceClient), nameof(IClaimsServiceClient.ReloadAsync))]
    Task RefreshClaimsAsync(CancellationToken cancellationToken);

    /// <summary>User must be authenticated or in a workflow.</summary>
    [DelegateTo(typeof(ILastSessionServiceClient), nameof(ILastSessionServiceClient.GetAsync))]
    LastSession GetLastSession(bool cached = true);

    /// <summary>User must be authenticated or in a workflow.</summary>
    [DelegateTo(typeof(ILastSessionServiceClient), nameof(ILastSessionServiceClient.GetAsync))]
    Task<LastSession> GetLastSessionAsync(CancellationToken cancellationToken, bool cached = true);

    /// <summary>User must be authenticated or in a workflow.</summary>
    [DelegateTo(typeof(ICurrentSessionServiceClient), nameof(ICurrentSessionServiceClient.GetAsync))]
    CurrentSession GetCurrentSession();

    /// <summary>User must be authenticated or in a workflow.</summary>
    [DelegateTo(typeof(ICurrentSessionServiceClient), nameof(ICurrentSessionServiceClient.GetAsync))]
    Task<CurrentSession> GetCurrentSessionAsync(CancellationToken cancellationToken);

    /// <summary>User must be authenticated or in a workflow.</summary>
    [DelegateTo(typeof(IPendingActionsServiceClient), nameof(IPendingActionsServiceClient.GetAsync))]
    PendingActionList GetPendingActions();

    /// <summary>User must be authenticated or in a workflow.</summary>
    [DelegateTo(typeof(IPendingActionsServiceClient), nameof(IPendingActionsServiceClient.GetAsync))]
    Task<PendingActionList> GetPendingActionsAsync(CancellationToken cancellationToken);

    /// <summary>User must be authenticated or in a workflow.</summary>
    [DelegateTo(typeof(IVerificationStatusServiceClient), nameof(IVerificationStatusServiceClient.GetAsync))]
    Task<IReadOnlyDictionary<string, string>> GetCommVerificationStatusAsync(CancellationToken cancellationToken, bool cached = true);

    /// <summary>User must be authenticated or in a workflow.</summary>
    [DelegateTo(typeof(IVerificationStatusServiceClient), nameof(IVerificationStatusServiceClient.GetAsync))]
    IReadOnlyDictionary<string, string> GetCommVerificationStatus(bool cached = true);

    /// <summary>User must be authenticated or in a workflow.</summary>
    [DelegateTo(typeof(ISessionSummaryServiceClient), nameof(ISessionSummaryServiceClient.GetAsync))]
    Task<SessionSummaryResponse> GetSessionSummaryAsync(
        CancellationToken cancellationToken,
        UtcDateTime startDate,
        UtcDateTime endDate,
        string aggregationType,
        string timeZone,
        bool cached = true);
}

internal interface IPosApiAuthenticationServiceInternal : IPosApiAuthenticationService
{
    /// <summary>User must be authenticated or in a workflow.</summary>
    [DelegateTo(typeof(ILastSessionServiceClient), nameof(ILastSessionServiceClient.GetAsync))]
    Task<LastSession> GetLastSessionAsync(ExecutionMode mode, bool cached = true);

    [DelegateTo(typeof(IRefreshTokenServiceClient), nameof(IRefreshTokenServiceClient.RefreshAsync))]
    Task RefreshTokenAsync(CancellationToken cancellationToken);

    [DelegateTo(typeof(IClaimsServiceClient), nameof(IClaimsServiceClient.SetupUserAsync))]
    Task<ClaimsPrincipal> SetupUserAsync(PosApiAuthTokens authTokens, bool validateAuthOnPosApi, CancellationToken cancellationToken);

    [DelegateTo(typeof(IClaimsServiceClient), nameof(IClaimsServiceClient.SetupAnonymousUserAsync))]
    Task<ClaimsPrincipal> SetupAnonymousUserAsync(CancellationToken cancellationToken);

    [DelegateTo(typeof(ILogoutServiceClient), nameof(ILogoutServiceClient.LogoutAsync))]
    Task LogoutAsync(ExecutionMode mode);

    [DelegateTo(typeof(ILogoutServiceClient), nameof(ILogoutServiceClient.CancelWorkflowAsync))]
    Task CancelWorkflowAndLogoutAsync(CancellationToken cancellationToken);

    [DelegateTo(typeof(IAddWorkflowDataServiceClient), nameof(IAddWorkflowDataServiceClient.AddWorkflowDataAsync))]
    Task AddWorkflowDataAsync(IReadOnlyDictionary<string, string> workflowData, CancellationToken cancellationToken);

    /// <summary>User must be authenticated or in a workflow.</summary>
    [DelegateTo(typeof(IVerificationStatusServiceClient), nameof(IVerificationStatusServiceClient.GetAsync))]
    Task<IReadOnlyDictionary<string, string>> GetCommVerificationStatusAsync(ExecutionMode mode, bool cached = true);

    /// <summary>User must be authenticated and limits set.</summary>
    [DelegateTo(typeof(ISessionLimitsServiceClient), nameof(ISessionLimitsServiceClient.SaveUserPopupSelection))]
    Task SaveUserPopupSelection(CancellationToken cancellationToken, SessionLimitsData sessionLimitData);
}
