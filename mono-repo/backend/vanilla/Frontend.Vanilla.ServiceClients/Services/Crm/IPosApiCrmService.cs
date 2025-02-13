using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Crm.BonusBalance;
using Frontend.Vanilla.ServiceClients.Services.Crm.CampaignDatas;
using Frontend.Vanilla.ServiceClients.Services.Crm.Gamification;
using Frontend.Vanilla.ServiceClients.Services.Crm.InvitationUrl;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyPoint;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;
using Frontend.Vanilla.ServiceClients.Services.Crm.MappedQuery;
using Frontend.Vanilla.ServiceClients.Services.Crm.PlayerAttributes;
using Frontend.Vanilla.ServiceClients.Services.Crm.PlayerGamingDeclaration;
using Frontend.Vanilla.ServiceClients.Services.Crm.ReferredFriends;
using Frontend.Vanilla.ServiceClients.Services.Crm.SignUpBonuses;
using Frontend.Vanilla.ServiceClients.Services.Crm.UserFlags;
using Frontend.Vanilla.ServiceClients.Services.Crm.UserScrub;
using Frontend.Vanilla.ServiceClients.Services.Crm.ValueSegments;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.ServiceClients.Services.Crm;

/// <summary>
/// Represents CRM.svc PosAPI service.
/// </summary>
public interface IPosApiCrmService
{
    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IFutureLoyaltyProfileServiceClient), nameof(IFutureLoyaltyProfileServiceClient.GetFullProfileAsync))]
    LoyaltyProfile GetLoyaltyProfile(bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IFutureLoyaltyProfileServiceClient), nameof(IFutureLoyaltyProfileServiceClient.GetFullProfileAsync))]
    Task<LoyaltyProfile> GetLoyaltyProfileAsync(CancellationToken cancellationToken, bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IFutureLoyaltyProfileServiceClient), nameof(IFutureLoyaltyProfileServiceClient.GetBasicProfileAsync))]
    BasicLoyaltyProfile GetBasicLoyaltyProfile(bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IFutureLoyaltyProfileServiceClient), nameof(IFutureLoyaltyProfileServiceClient.GetBasicProfileAsync))]
    Task<BasicLoyaltyProfile> GetBasicLoyaltyProfileAsync(CancellationToken cancellationToken, bool cached = true);

    /// <summary>User must be authenticated or in workflow.</summary>
    [DelegateTo(typeof(IValueSegmentServiceClient), nameof(IValueSegmentServiceClient.GetAsync))]
    ValueSegment GetValueSegment(bool cached = true);

    /// <summary>User must be authenticated or in workflow.</summary>
    [DelegateTo(typeof(IValueSegmentServiceClient), nameof(IValueSegmentServiceClient.GetAsync))]
    Task<ValueSegment> GetValueSegmentAsync(CancellationToken cancellationToken, bool cached = true);

    /// <summary>User must be authenticated or in workflow.</summary>
    [DelegateTo(typeof(IUserFlagsServiceClient), nameof(IUserFlagsServiceClient.GetAsync))]
    Task<IReadOnlyList<UserFlag>> GetUserFlagsAsync(CancellationToken cancellationToken, bool cached = true);
}

internal interface IPosApiCrmServiceInternal : IPosApiCrmService
{
    /// <summary>User must be authenticated or in workflow.</summary>
    [DelegateTo(typeof(ICampaignDataServiceClient), nameof(ICampaignDataServiceClient.GetCachedAsync))]
    Task<IReadOnlyList<CampaignData>> GetCampaignsAsync(ExecutionMode mode);

    [DelegateTo(typeof(ISignUpBonusServiceClient), nameof(ISignUpBonusServiceClient.BonusExistsAsync))]
    Task<bool> BonusExistsAsync(ExecutionMode mode, int trackerId, string bonusStage);

    [DelegateTo(typeof(ISignUpBonusServiceClient), nameof(ISignUpBonusServiceClient.GetBonusFlowContentAsync))]
    Task<SignUpBonusFlowContent> GetBonusFlowContentAsync(ExecutionMode mode, int trackerId, string bonusStage);

    [DelegateTo(typeof(IMappedQueryServiceClient), nameof(IMappedQueryServiceClient.GetAsync))]
    Task<MappedQueryResult> MapQueryAsync(CancellationToken cancellationToken, Dictionary<string, StringValues> query, bool useOnlyWmId);

    [DelegateTo(typeof(IUserScrubServiceClient), nameof(IUserScrubServiceClient.GetAsync))]
    Task<UserScrub.UserScrub> GetUserScrubAsync(ExecutionMode mode, UserScrubRequest request);

    [DelegateTo(typeof(ILoyaltyPointsServiceClient), nameof(ILoyaltyPointsServiceClient.GetAsync))]
    decimal GetLoyaltyPoints();

    [DelegateTo(typeof(ILoyaltyPointsServiceClient), nameof(ILoyaltyPointsServiceClient.GetAsync))]
    Task<decimal> GetLoyaltyPointsAsync(CancellationToken cancellationToken);

    [DelegateTo(typeof(ILoyaltyPointsServiceClient), nameof(ILoyaltyPointsServiceClient.GetAsync))]
    Task<decimal> GetLoyaltyPointsAsync(ExecutionMode mode);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IFutureLoyaltyProfileServiceClient), nameof(IFutureLoyaltyProfileServiceClient.GetBasicProfileAsync))]
    Task<BasicLoyaltyProfile> GetBasicLoyaltyProfileAsync(ExecutionMode mode, bool cached = true);

    /// <summary>User must be authenticated or in workflow.</summary>
    [DelegateTo(typeof(IValueSegmentServiceClient), nameof(IValueSegmentServiceClient.GetAsync))]
    Task<ValueSegment> GetValueSegmentAsync(ExecutionMode mode, bool cached = true);

    [DelegateTo(typeof(IBonusBalanceServiceClient), nameof(IBonusBalanceServiceClient.GetAsync))]
    Task<IReadOnlyDictionary<string, ProductBonusInfo>> GetBonusBalanceAsync(CancellationToken cancellationToken, bool cached = true);

    [DelegateTo(typeof(IBonusBalanceServiceClient), nameof(IBonusBalanceServiceClient.GetAsync))]
    Task<IReadOnlyDictionary<string, ProductBonusInfo>> GetBonusBalanceAsync(ExecutionMode mode, bool cached = true);

    [DelegateTo(typeof(IUserFlagsServiceClient), nameof(IUserFlagsServiceClient.GetAsync))]
    Task<IReadOnlyList<UserFlag>> GetUserFlagsAsync(ExecutionMode mode, bool cached = true);

    [DelegateTo(typeof(IUserFlagsServiceClient), nameof(IUserFlagsServiceClient.InvalidateCached))]
    void InvalidateCached();

    [DelegateTo(typeof(IPlayerGamingDeclarationServiceClient), nameof(IPlayerGamingDeclarationServiceClient.GetAsync))]
    Task<GamingDeclaration> GetPlayerGamingDeclarationAsync(ExecutionMode mode);

    [DelegateTo(typeof(IPlayerGamingDeclarationServiceClient), nameof(IPlayerGamingDeclarationServiceClient.AcceptDeclarationAsync))]
    Task AcceptDeclarationAsync(GamingDeclarationRequest declarationRequest, ExecutionMode mode);

    [DelegateTo(typeof(IGamificationServiceClient), nameof(IGamificationServiceClient.GetCoinBalance))]
    Task<CoinsBalance> GamificationCoinsBalance(ExecutionMode mode, CoinsBalanceRequest coinsBalanceRequest);

    [DelegateTo(typeof(IReferredFriendsServiceClient), nameof(IReferredFriendsServiceClient.GetAsync))]
    Task<ReferredFriends.ReferredFriends> GetReferredFriendsAsync(ExecutionMode mode, bool cached = true);

    [DelegateTo(typeof(IInvitationUrlServiceClient), nameof(IInvitationUrlServiceClient.GetAsync))]
    Task<InvitationUrl.InvitationUrl> GetInvitationUrlAsync(ExecutionMode mode, bool cached = true);

    [DelegateTo(typeof(IPlayerAttributesServiceClient), nameof(IPlayerAttributesServiceClient.GetAsync))]
    Task<PlayerAttributesDto> GetPlayerAttributesAsync(ExecutionMode mode, bool cached = true);
}
