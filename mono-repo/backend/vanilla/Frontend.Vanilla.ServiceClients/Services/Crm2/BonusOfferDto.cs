using System;
using System.Runtime.Serialization;
using System.Xml.Serialization;
using Frontend.Vanilla.ServiceClients.Services.Crm2.Models;

namespace Frontend.Vanilla.ServiceClients.Services.Crm2;

[DataContract(Name = "BonusOffer", Namespace = "")]
[XmlRoot(ElementName = "BonusOffer", Namespace = "")]
internal class BonusOfferDto
{
    [DataMember(Name = "accountName")]
    [XmlAttribute("accountName")]
    public string AccountName { get; set; }

    [DataMember(Name = "bonusAccountCurrencyCode")]
    [XmlAttribute("bonusAccountCurrencyCode")]
    public string BonusAccountCurrencyCode { get; set; }

    [DataMember(Name = "bonusAccountValue")]
    [XmlAttribute("bonusAccountValue")]
    public decimal BonusAccountValue { get; set; }

    [DataMember(Name = "bonusCode")]
    [XmlAttribute("bonusCode")]
    public string BonusCode { get; set; }

    [DataMember(Name = "bonusExpiryDate")]
    [XmlAttribute("bonusExpiryDate")]
    public DateTime BonusExpiryDate { get; set; }

    [DataMember(Name = "bonusExpiryDays")]
    [XmlAttribute("bonusExpiryDays")]
    public int BonusExpiryDays { get; set; }

    [DataMember(Name = "bonusFreerollId")]
    [XmlAttribute("bonusFreerollId")]
    public int BonusFreerollId { get; set; }

    [DataMember(Name = "bonusId")]
    [XmlAttribute("bonusId")]
    public int BonusId { get; set; }

    [DataMember(Name = "bonusIssueId")]
    [XmlAttribute("bonusIssueId")]
    public int BonusIssueId { get; set; }

    [DataMember(Name = "bonusOfferedDate")]
    [XmlAttribute("bonusOfferedDate")]
    public DateTime BonusOfferedDate { get; set; }

    [DataMember(Name = "bonusOfferExpiryDate")]
    [XmlAttribute("bonusOfferExpiryDate")]
    public DateTime BonusOfferExpiryDate { get; set; }

    [DataMember(Name = "bonusOfferReleaseConditions")]
    [XmlArray(ElementName = "bonusOfferReleaseConditions")]
    [XmlArrayItem(ElementName = "BonusOfferReleaseCondition")]
    public BonusOfferReleaseCondition[] BonusOfferReleaseConditions { get; set; }

    [DataMember(Name = "bonusReleaseCount")]
    [XmlAttribute("bonusReleaseCount")]
    public int BonusReleaseCount { get; set; }

    [DataMember(Name = "bonusRestrictionTypeId")]
    [XmlAttribute("bonusRestrictionTypeId")]
    public int BonusRestrictionTypeId { get; set; }

    [DataMember(Name = "bonusRuleCurrencyCode")]
    [XmlAttribute("bonusRuleCurrencyCode")]
    public string BonusRuleCurrencyCode { get; set; }

    [DataMember(Name = "bonusRuleValue")]
    [XmlAttribute("bonusRuleValue")]
    public decimal BonusRuleValue { get; set; }

    [DataMember(Name = "bonusSeqId")]
    [XmlAttribute("bonusSeqId")]
    public int BonusSeqId { get; set; }

    [DataMember(Name = "bonusTypeId")]
    [XmlAttribute("bonusTypeId")]
    public int BonusTypeId { get; set; }

    [DataMember(Name = "bonusValueTypeId")]
    [XmlAttribute("bonusValueTypeId")]
    public int BonusValueTypeId { get; set; }

    [DataMember(Name = "brandIds")]
    [XmlArray(ElementName = "brandIds")]
    [XmlArrayItem(ElementName = "BrandId")]
    public string[] BrandIds { get; set; }

    [DataMember(Name = "brandsConditionType")]
    [XmlAttribute("brandsConditionType")]
    public string BrandsConditionType { get; set; }

    [DataMember(Name = "campaignId")]
    [XmlAttribute("campaignId")]
    public int CampaignId { get; set; }

    [DataMember(Name = "campaignName")]
    [XmlAttribute("campaignName")]
    public string CampaignName { get; set; }

    [DataMember(Name = "campaignType")]
    [XmlAttribute("campaignType")]
    public string CampaignType { get; set; }

    [DataMember(Name = "bonusChannelInfos")]
    [XmlArray(ElementName = "bonusChannelInfos")]
    [XmlArrayItem(ElementName = "bonusChannelInfo")]
    public BonusChannelInfo[] ChannelInfo { get; set; }

    [DataMember(Name = "depositRestrictionType")]
    [XmlAttribute("depositRestrictionType")]
    public int DepositRestrictionType { get; set; }

    [DataMember(Name = "expiryRecoveryType")]
    [XmlAttribute("expiryRecoveryType")]
    public int ExpiryRecoveryType { get; set; }

    [DataMember(Name = "gameVariantBonusInfos")]
    [XmlArray(ElementName = "gameVariantBonusInfos")]
    [XmlArrayItem(ElementName = "gameVariantBonusInfo")]
    public GameVariantBonusInfo[] GameVariantBonusInfo { get; set; }

    [DataMember(Name = "isBonusOfferIssued")]
    [XmlAttribute("isBonusOfferIssued")]
    public bool IsBonusOfferIssued { get; set; }

    [DataMember(Name = "isBonusOfferLocked")]
    [XmlAttribute("isBonusOfferLocked")]
    public bool IsBonusOfferLocked { get; set; }

    [DataMember(Name = "isKycBonus")]
    [XmlAttribute("isKycBonus")]
    public bool IsKycBonus { get; set; }

    [DataMember(Name = "isLinkedBonus")]
    [XmlAttribute("isLinkedBonus")]
    public bool IsLinkedBonus { get; set; }

    [DataMember(Name = "isNextActionOnDrop")]
    [XmlAttribute("isNextActionOnDrop")]
    public bool IsNextActionOnDrop { get; set; }

    [DataMember(Name = "isNextActionOnExhaust")]
    [XmlAttribute("isNextActionOnExhaust")]
    public bool IsNextActionOnExhaust { get; set; }

    [DataMember(Name = "isNextActionOnRelease")]
    [XmlAttribute("isNextActionOnRelease")]
    public bool IsNextActionOnRelease { get; set; }

    [DataMember(Name = "isOptInEnabled")]
    [XmlAttribute("isOptInEnabled")]
    public bool IsOptInEnabled { get; set; }

    [DataMember(Name = "isPartialBonusRule")]
    [XmlAttribute("isPartialBonusRule")]
    public bool IsPartialBonusRule { get; set; }

    [DataMember(Name = "isPartialIssueBonus")]
    [XmlAttribute("isPartialIssueBonus")]
    public bool IsPartialIssueBonus { get; set; }

    [DataMember(Name = "isTncAccepted")]
    [XmlAttribute("isTncAccepted")]
    public bool IsTncAccepted { get; set; }

    [DataMember(Name = "isWinningsRestricted")]
    [XmlAttribute("isWinningsRestricted")]
    public bool IsWinningsRestricted { get; set; }

    [DataMember(Name = "maxBonusAccountAmount")]
    [XmlAttribute("maxBonusAccountAmount")]
    public decimal MaxBonusAccountAmount { get; set; }

    [DataMember(Name = "maxBonusRuleAmount")]
    [XmlAttribute("maxBonusRuleAmount")]
    public decimal MaxBonusRuleAmount { get; set; }

    [DataMember(Name = "maxNumberOfReuse")]
    [XmlAttribute("maxNumberOfReuse")]
    public int MaxNumberOfReuse { get; set; }

    [DataMember(Name = "minDepositRequiredAccountAmount")]
    [XmlAttribute("minDepositRequiredAccountAmount")]
    public decimal MinDepositRequiredAccountAmount { get; set; }

    [DataMember(Name = "minDepositRequiredRuleAmount")]
    [XmlAttribute("minDepositRequiredRuleAmount")]
    public decimal MinDepositRequiredRuleAmount { get; set; }

    [DataMember(Name = "minOdds")]
    [XmlAttribute("minOdds")]
    public string MinOdds { get; set; }

    [DataMember(Name = "numberOfSlabs")]
    [XmlAttribute("numberOfSlabs")]
    public int NumberOfSlabs { get; set; }

    [DataMember(Name = "offerArc")]
    [XmlAttribute("offerArc")]
    public int OfferArc { get; set; }

    [DataMember(Name = "offerDescription")]
    [XmlAttribute("offerDescription")]
    public string OfferDescription { get; set; }

    [DataMember(Name = "offerId")]
    [XmlAttribute("offerId")]
    public long OfferId { get; set; }

    [DataMember(Name = "offerStatus")]
    [XmlAttribute("offerStatus")]
    public string OfferStatus { get; set; }

    [DataMember(Name = "releaseConditionType")]
    [XmlAttribute("releaseConditionType")]
    public string ReleaseConditionType { get; set; }

    [DataMember(Name = "schedulingInfo")]
    [XmlElement(ElementName = "SchedulingInfo")]
    public SchedulingInfo SchedulingInfo { get; set; }

    [DataMember(Name = "timeToClaim")]
    [XmlAttribute("timeToClaim")]
    public int TimeToClaim { get; set; }

    [DataMember(Name = "timeToClear")]
    [XmlAttribute("timeToClear")]
    public int TimeToClear { get; set; }

    [DataMember(Name = "TotalLeftBonusAccountAmount")]
    [XmlAttribute("TotalLeftBonusAccountAmount")]
    public decimal TotalLeftBonusAccountAmount { get; set; }

    [DataMember(Name = "totalUsedBonusAccountAmount")]
    [XmlAttribute("totalUsedBonusAccountAmount")]
    public decimal TotalUsedBonusAccountAmount { get; set; }

    [DataMember(Name = "tourneyAmount")]
    [XmlAttribute("tourneyAmount")]
    public decimal TourneyAmount { get; set; }

    [DataMember(Name = "tourneyCurrencyCode")]
    [XmlAttribute("tourneyCurrencyCode")]
    public string TourneyCurrencyCode { get; set; }

    [DataMember(Name = "unlockDate")]
    [XmlAttribute("unlockDate")]
    public DateTime UnlockDate { get; set; }

    [DataMember(Name = "eligableForCasinoCoefficient")]
    [XmlAttribute("eligableForCasinoCoefficient")]
    public bool EligableForCasinoCoefficient { get; set; }
}

internal sealed class BonusOfferReleaseCondition
{
    public string Product { get; set; }
    public decimal BonusAmountRuleValue { get; set; }
    public decimal BonusAmountAccountValue { get; set; }
    public int SlabNumber { get; set; }
    public int NumberOfSlabs { get; set; }
    public bool IsPartialBonusRule { get; set; }
    public bool IsCurrencyAttached { get; set; }
    public string GamingActivityMultiKey { get; set; }
    public string ActivityAccountCurrencyCode { get; set; }
    public decimal ActivityAccountValue { get; set; }
    public string ActivityRuleCurrencyCode { get; set; }
    public decimal ActivityRuleValue { get; set; }
    public string GameConditionType { get; set; }
    public string[] Games { get; set; }
    public string GamingActivityKey { get; set; }
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

internal sealed class SchedulingInfo
{
    public int[] MonthDays { get; set; }
    public string[] WeekDays { get; set; }
    public int DailyCap { get; set; }
    public int UsedToday { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public string TimeZone { get; set; }
    public string ScheduleType { get; set; }
}
