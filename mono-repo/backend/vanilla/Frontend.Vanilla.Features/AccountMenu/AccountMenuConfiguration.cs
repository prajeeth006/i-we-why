using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage;

#pragma warning disable CS1591

namespace Frontend.Vanilla.Features.AccountMenu;

public sealed class Onboarding
{
    public int ShowHeaderHotspotLoginCount { get; set; }
    public int ShowPulseEffectLoginCount { get; set; }
    public int ShowAccountMenuHotspotLoginCount { get; set; }
}

public interface IAccountMenuConfiguration
{
    IDslExpression<bool> PaypalBalanceMessageEnabled { get; }
    IDslExpression<bool> PaypalReleaseFundsEnabled { get; }
    IList<string> VipLevels { get; }
    bool IgnoreVipLevel { get; }
    int Version { get; }
    string? CashbackType { get; }
    Onboarding Onboarding { get; }
    bool ShowHeaderBarClose { get; }
    IList<string> PokerCashbackTournamentAwardTypes { get; }
    string TournamentPokerCashbackSymbol { get; }
    IList<string> LeftMenuEnabledOnCustomerHub { get; }
    bool UseLoyaltyBannerV2 { get; }
    IReadOnlyDictionary<string, int> ProfilePageItemsPosition { get; }
}

internal class AccountMenuConfiguration(
    IDslExpression<bool> paypalBalanceMessageEnabled,
    IDslExpression<bool> paypalReleaseFundsEnabled,
    IEnumerable<string> vipLevels,
    bool ignoreVipLevel,
    int version,
    Onboarding onboarding,
    string? cashbackType,
    bool showHeaderBarClose,
    IList<string> pokerCashbackTournamentAwardTypes,
    string tournamentPokerCashbackSymbol,
    IEnumerable<string> leftMenuEnabledOnCustomerHub,
    bool useLoyaltyBannerV2,
    IReadOnlyDictionary<string, int> profilePageItemsPosition)
    : IAccountMenuConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI.AccountMenu";

    public IDslExpression<bool> PaypalBalanceMessageEnabled { get; set; } = Guard.NotNull(paypalBalanceMessageEnabled, nameof(paypalBalanceMessageEnabled));
    public IDslExpression<bool> PaypalReleaseFundsEnabled { get; set; } = Guard.NotNull(paypalReleaseFundsEnabled, nameof(paypalReleaseFundsEnabled));
    public IList<string> VipLevels { get; set; } = Guard.NotNullItems(vipLevels?.ToArray(), nameof(vipLevels));
    public bool IgnoreVipLevel { get; set; } = ignoreVipLevel;
    public int Version { get; set; } = version;
    public Onboarding Onboarding { get; set; } = onboarding;
    public string? CashbackType { get; set; } = cashbackType;
    public bool ShowHeaderBarClose { get; set; } = showHeaderBarClose;
    public IList<string> PokerCashbackTournamentAwardTypes { get; set; } = pokerCashbackTournamentAwardTypes;
    public string TournamentPokerCashbackSymbol { get; } = tournamentPokerCashbackSymbol;
    public IList<string> LeftMenuEnabledOnCustomerHub { get; } = Guard.NotNullItems(leftMenuEnabledOnCustomerHub?.ToArray(), nameof(leftMenuEnabledOnCustomerHub));
    public bool UseLoyaltyBannerV2 { get; } = useLoyaltyBannerV2;
    public IReadOnlyDictionary<string, int> ProfilePageItemsPosition { get; } = profilePageItemsPosition;
}
