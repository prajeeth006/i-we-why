using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Frontend.Vanilla.ServiceClients.Services.Crm2.Models;

internal sealed class BonusDto
{
    [JsonProperty(NamingStrategyType = typeof(DefaultNamingStrategy))]
    public IssuedBonus[] IssuedBonuses { get; set; }

    public bool ShowChannelInfo { get; set; }
}

internal sealed class IssuedBonus
{
    public int PointsFlag { get; set; }
    public string[] BrandIds { get; set; }
    public string BrandsConditionType { get; set; }
    public BonusReleaseCondition[] BonusReleaseConditions { get; set; }
    public BonusGamePlayed[] BonusGamesPlayed { get; set; }
    public int PlayerPreferenceOrder { get; set; }
    public bool IsPartialIssuedBonus { get; set; }
    public int NumberOfSlabsReleased { get; set; }
    public int NumberOfSlabs { get; set; }
    public string CampaignType { get; set; }
    public bool DisconnectOnExhaust { get; set; }
    public decimal RestrictedDepositAmount { get; set; }
    public bool DisconnectOnWithdrawal { get; set; }
    public bool DisconnectOnExpires { get; set; }
    public bool IsLastInCampaign { get; set; }
    public bool IsKycBonus { get; set; }
    public string MinOdds { get; set; }
    public decimal BonusClaimbackAmount { get; set; }

    [JsonProperty("bonusChannelInfos")]
    public BonusChannelInfo[] ChannelInfo { get; set; }

    public decimal WinningClaimbackAmount { get; set; }

    [JsonProperty("gameVariantBonusInfos")]
    public GameVariantBonusInfo[] GameVariantBonusInfo { get; set; }

    public decimal TotalRecoverAmount { get; set; }
    public bool EligableForCasinoCoefficient { get; set; }

    [JsonProperty("sportsGVBInfo")]
    public SportsGvbInfo SportsGvbInfo { get; set; }

    public bool DisconnectOnDrop { get; set; }
    public decimal CurrentRestrictedAmount { get; set; }
    public int DepositTransactionId { get; set; }
    public decimal DepositAmount { get; set; }
    public string AccountName { get; set; }
    public bool IsBonusActive { get; set; }
    public int BonusId { get; set; }
    public string BonusCode { get; set; }
    public int BonusIssueId { get; set; }
    public int BonusTypeId { get; set; }
    public int BonusRestrictionTypeId { get; set; }
    public DateTime BonusIssuedDate { get; set; }
    public int BonusStatusId { get; set; }
    public decimal BonusAmount { get; set; }
    public int BonusFreerollId { get; set; }
    public decimal TourneyAmount { get; set; }
    public string TourneyCurrencyCode { get; set; }
    public bool IsDepositRestricted { get; set; }
    public bool IsWinningsRestricted { get; set; }
    public int OfferBonusValueTypeId { get; set; }
    public decimal OfferBonusValue { get; set; }
    public decimal OfferMaxBonusAmount { get; set; }
    public int OfferExpiryDays { get; set; }
    public DateTime BonusOfferedDate { get; set; }
    public DateTime BonusExpiryDate { get; set; }
    public decimal ReleasedBonusAmount { get; set; }
    public DateTime BonusReleaseDate { get; set; }
    public DateTime BonusDroppedDate { get; set; }
    public int ExpiryRecoveryTypeId { get; set; }
    public bool ShowMaxBetInfo { get; set; }
    public List<KeyValue> AdditionalInfo { get; set; }
}

internal sealed class BonusReleaseCondition
{
    public string[] Games { get; set; }
    public string GameConditionType { get; set; }
    public string BrandId { get; set; }
    public SlabReleaseCondition[] SlabReleaseConditions { get; set; }
    public ReleaseConditionGameVariant GameVariant { get; set; }
}

internal sealed class ReleaseConditionGameVariant
{
    public string GameType { get; set; }
    public string Variant { get; set; }
    public string NoOfSeats { get; set; }
    public string PokerStakes { get; set; }
    public string PlayerPool { get; set; }
}

internal sealed class SlabReleaseCondition
{
    public long SlabNumber { get; set; }
    public int GameCountCurrentValue { get; set; }
    public decimal BonusAmount { get; set; }
    public long BonusTransactionId { get; set; }
    public long StatusId { get; set; }
    public decimal TotalRelease { get; set; }
    public string GamingActivityKey { get; set; }
    public string ProductId { get; set; }
    public decimal CurrencyAttached { get; set; }
    public decimal PendingRelease { get; set; }
}

internal sealed class BonusGamePlayed
{
    public int GameTypeId { get; set; }
    public int GameCountTypeId { get; set; }
    public int GameCountRequiredValue { get; set; }
    public int GameCountCurrentValue { get; set; }
}

internal sealed class BonusChannelInfo
{
    public string ChannelCatagory { get; set; }
    public string ChannelType { get; set; }
}

internal sealed class GameVariantBonusInfo
{
    public string Game { get; set; }
    public string Key { get; set; }

    [JsonProperty("subgames")]
    public string[] SubGames { get; set; }
}

internal sealed class SportsGvbInfo
{
    public double BettingOdds { get; set; }
    public List<long> ExcludedEligibilityIds { get; set; }
    public string ExcludedEligibilityType { get; set; }
    public string GameType { get; set; }
    public List<long> IncludedEligibilityIds { get; set; }
    public string IncludedEligibilityType { get; set; }
    public long MinBetAmount { get; set; }
    public int MinNoOfBets { get; set; }
    public int NoOfSelections { get; set; }
    public double OverallBettingOdds { get; set; }
    public string SitecoreTemplateId { get; set; }
    public List<int> SkipKinds { get; set; }
    public List<int> SlipTypes { get; set; }
    public List<long> SportIds { get; set; }
    public List<KeyValue> EligibilityContent { get; set; }
}

internal sealed class KeyValue
{
    public KeyValue() { }

    public KeyValue(string key, string value) { }

    [JsonProperty(NamingStrategyType = typeof(DefaultNamingStrategy))]
    public string Key { get; set; }

    [JsonProperty(NamingStrategyType = typeof(DefaultNamingStrategy))]
    public string Value { get; set; }
}
