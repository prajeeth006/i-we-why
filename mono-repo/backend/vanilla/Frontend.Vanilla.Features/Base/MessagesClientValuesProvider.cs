#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.Base.Models;
using Frontend.Vanilla.Features.Games;
using Frontend.Vanilla.Features.Inbox.ContentProviders;
using Frontend.Vanilla.Features.RtmsLayer;
using Frontend.Vanilla.Features.TermsAndConditions;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Base;

internal interface IMessagesClientValuesProvider<out TOut, in TIn, TMsgContent>
    where TOut : MessageResultBase<TMsgContent>, new()
    where TIn : class
    where TMsgContent : new()
{
    TOut GetMessage(TIn messageData);
    IEnumerable<TOut> GetMessages(IEnumerable<TIn> messageDatas, bool disregardContentErrors = false);
}

internal abstract class MessagesClientValuesProvider<TOut, TIn, TMsgContent>(
    IContentService contentService,
    IEnvironmentProvider environmentProvider,
    ITermsAndConditionsContentProvider termsAndConditionsContentProvider,
    ILogger log)
    : IMessagesClientValuesProvider<TOut, TIn, TMsgContent>
    where TOut : MessageResultBase<TMsgContent>, new()
    where TIn : class
    where TMsgContent : new()
{
    private const string TncTemplateKey = "#TNC_TEMPLATE#";

    private const string MiscTnCTemplateKey = "#MISC_TEMPLATE#";

    // private const string MiscTnCTemplateKey = "#MISC_TEMPLATE#";
    private const string ApplicableDesktopGamesKey = "#APPLICABLE_NON_MOBILE_GAMES#";
    private const string ApplicableMobileGamesKey = "#APPLICABLE_MOBILE_GAMES#";
    private const string ApplicableNonMobileChannelsKey = "#APPLICABLE_NONMOBILE_CHANNELS#";
    private const string ApplicableMobileChannelsKey = "#APPLICABLE_MOBILE_CHANNELS#";
    private const string SourceReferenceIdKey = "#SOURCE_REFERENCE_ID#";
    private const string BonusCodeKey = "#BONUS_CODE#";
    private const string BonusTypeKey = "#BONUS_TYPE#";
    private const string PromoReward = "PROMO_REWARD";
    private const string PromoTarget = "PROMO_TARGET";
    private const string EdsOffer = "EDS_OFFER";
    private const string ComplianceOffer = "COMPLIANCE";
    private const string NoDepositBonusType = "6";
    private const string ChannelIsMobileWeb = "MOBILEWEB";
    private const string BonusSourceStatusKey = "#BONUS_SOURCE_STATUS#";
    private const string OfferIdKey = "#OFFER_ID#";
    private const string IsCampaignBonusKey = "#IS_CAMPAIGN_BONUS#";
    private const string BonusPlpKey = "BONUS_PLP";
    private const string Yes = "YES";
    private const string BonusIdKey = "#BONUS_ID#";
    private const string TncAcceptanceKey = "#TNC_ACCPETANCE_FLAG#";
    private const string RewardTypeKey = "#REWARD_TYPE#";
    private readonly string[] tnCRewardTypes = { "ODDSBOOST_TOKEN", "RISKFREE_TOKEN" };

    // public InboxMessageViewModel GetMessage(IInboxMessage inboxMessage)
    protected TOut BuildMessageBasePart(
        string messageId,
        string sitecoreId,
        string messageType,
        IReadOnlyDictionary<string, string> templateMetaData,
        TIn messageData,
        string source = null)
    {
        // TODO: handle case when there is no content provider for the messageSource returned by POSAPi
        // some default should be probably used but we do not have defaul template in SiteCore should the offer to use?
        // or the message should be just excluded?
        List<GameAllInfo> mobileAllList;
        List<MobileGameInfo> mobileGameList;
        List<KeyValuePair<string, List<MobileGameInfo>>> desktopSectionGamesPairs;
        bool isAllDesktopGames;
        var mobileSectionGamesPairs = desktopSectionGamesPairs = null;
        var desktopAllList = mobileAllList = null;
        var desktopGameList = mobileGameList = null;
        var isAllMobileGames = isAllDesktopGames = false;
        var isBonusTeaser = source == BonusPlpKey;

        //-----------common
        var bonusCode = string.Empty;
        var isNoDepositBonus = false;
        var isCampaignBonus = false;
        var isBonusTncAccepted = false;
        string desktopApplicableGames = null,
            mobileApplicableGames = null,
            desktopChannelList = null,
            mobileChannelList = null,
            offerId = null,
            bonusPlpOfferId = null,
            bonusId = null;
        var bonusSourceStatus = string.Empty;
        //----------tnc
        var isTncNeeded = !new[] { PromoReward, PromoTarget, EdsOffer, ComplianceOffer }.Contains(messageType) ||
                          isBonusTeaser ||
                          (templateMetaData != null && templateMetaData.Any(o => o.Key == RewardTypeKey && tnCRewardTypes.Contains(o.Value)));
        var isTnCTemplate = false;
        string tnctemplateId = null,
            miscTnctemplateId = null;

        if (templateMetaData != null)
        {
            foreach (var pair in templateMetaData)
            {
                switch (pair.Key)
                {
                    // common
                    case BonusCodeKey:
                        bonusCode = pair.Value;

                        break;
                    case ApplicableDesktopGamesKey:
                        desktopApplicableGames = pair.Value;

                        break;
                    case ApplicableMobileGamesKey:
                        mobileApplicableGames = pair.Value;

                        break;
                    case ApplicableNonMobileChannelsKey:
                        desktopChannelList = pair.Value;

                        break;
                    case ApplicableMobileChannelsKey:
                        mobileChannelList = pair.Value;

                        break;
                    case SourceReferenceIdKey:
                        offerId = pair.Value;

                        break;
                    case BonusTypeKey:
                        isNoDepositBonus = pair.Value == NoDepositBonusType;

                        break;
                    case BonusSourceStatusKey:
                        bonusSourceStatus = pair.Value;

                        break;
                    case OfferIdKey:
                        bonusPlpOfferId = pair.Value;

                        break;
                    case IsCampaignBonusKey:
                        isCampaignBonus = pair.Value == Yes;

                        break;
                    case BonusIdKey:
                        bonusId = pair.Value;

                        break;
                    case TncAcceptanceKey:
                        isBonusTncAccepted = pair.Value == Yes;

                        break;

                    // tnc
                    case TncTemplateKey:
                        if (isTncNeeded)
                        {
                            isTnCTemplate = true;
                            tnctemplateId = pair.Value;
                        }

                        break;
                    case MiscTnCTemplateKey:
                        if (isTncNeeded)
                            miscTnctemplateId = pair.Value;

                        break;
                }
            }
        }

        var tncData = string.Empty;

        if (isTncNeeded)
        {
            try
            {
                var tncTemplateMetaData = termsAndConditionsContentProvider.ApplyCulturalFormatOnMetaData(templateMetaData);

                if (!string.IsNullOrEmpty(tnctemplateId))
                {
                    termsAndConditionsContentProvider.SetReplacementList(tncTemplateMetaData);
                    termsAndConditionsContentProvider.SetOddsBootsAndRiskFreeBetReplacement(messageData is RtmsMessageRequest);
                    tncData = termsAndConditionsContentProvider.GetTncContent(tnctemplateId, miscTnctemplateId);
                }
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Error occurred trying to build TNC Content");
                // Ignore (TnC is empty)
                tncData = string.Empty;
            }
        }

        var casinoHomeLink = contentService.Get<ILinkTemplate>("App-v1.0/Links/HomeCasino")?.Url?.OriginalString;
        var messages = contentService.Get<IViewTemplate>("MobileLogin-v1.0/Rtms/CasinoCategoryIconMappings").Messages;
        var casinoAllGamesIconSrc = messages.GetValue("allcasinogames");

        if (!string.IsNullOrEmpty(desktopApplicableGames) || !string.IsNullOrEmpty(mobileApplicableGames))
        {
            ParseGames(desktopApplicableGames, out desktopAllList, out desktopGameList, out desktopSectionGamesPairs, out isAllDesktopGames, casinoHomeLink);
            ParseGames(mobileApplicableGames, out mobileAllList, out mobileGameList, out mobileSectionGamesPairs, out isAllMobileGames, casinoHomeLink);
        }

        var resultBase = new TOut
        {
            Id = messageId,
            MessageType = messageType,
            Content = BuildMessageContent(messageData),
            SitecoreId = sitecoreId,
            // Addintion fileds required for CTA in preview mode
            OfferId = isBonusTeaser ? bonusPlpOfferId : offerId,
            IsNoDepositBonus = isNoDepositBonus,

            BonusCode = bonusCode,
            IsTnCTemplate = isTnCTemplate,
            TnCData = tncData,

            DesktopGameList = desktopGameList,
            MobileGameList = mobileGameList,
            DesktopAllList = desktopAllList,
            MobileAllList = mobileAllList,
            DesktopChannelList = desktopChannelList?.Split(','),
            MobileChannelList = mobileChannelList?.Split(','),
            DesktopSectionGamesPairs = desktopSectionGamesPairs,
            MobileSectionGamesPairs = mobileSectionGamesPairs,
            IsAllDesktopGames = isAllDesktopGames,
            IsAllMobileGames = isAllMobileGames,
            CasinoHomeLink = casinoHomeLink,
            ChannelId = ChannelIsMobileWeb,
            CasinoAllGamesIconSrc = casinoAllGamesIconSrc,
            BonusSourceStatus = bonusSourceStatus,
            IsCampaignBonus = isCampaignBonus,
            BonusId = bonusId,
            IsBonusTncAccepted = isBonusTncAccepted,
        };
        resultBase.SourceStatus = GetMessageSourceStatus(messageData, resultBase);

        return resultBase;
    }

    public IEnumerable<TOut> GetMessages(IEnumerable<TIn> inboxMessages, bool disregardErrors = false)
    {
        return inboxMessages.Select(GetMessage).Where(msgVm => disregardErrors || msgVm.Content != null).ToList();
    }

    public abstract TOut GetMessage(TIn messageData);
    protected abstract TMsgContent BuildMessageContent(TIn messageData);
    protected abstract string GetMessageSourceStatus(TIn messageData, MessageResultBase<TMsgContent> messageResultBase);
    protected abstract string GetCustomKey(TIn messageData, string key);

    private void ParseGames(
        string games,
        out List<GameAllInfo> allList,
        out List<MobileGameInfo> gameList,
        out List<KeyValuePair<string,
            List<MobileGameInfo>>> sectionGamesPairs,
        out bool isAllGames,
        string homeLink)
    {
        allList = new List<GameAllInfo>();
        gameList = new List<MobileGameInfo>();
        sectionGamesPairs = new List<KeyValuePair<string, List<MobileGameInfo>>>();
        isAllGames = false;

        if (games != null)
        {
            if (Regex.IsMatch(games, "ALL\\=ALL\\=ALL", RegexOptions.Multiline | RegexOptions.IgnoreCase))
            {
                isAllGames = true;
            }
            else
            {
                games = GetHandledAllGamesBySections(games, out allList, homeLink);
                gameList = ParseGames(games);

                if (gameList.Any())
                {
                    foreach (var groupItem in gameList.Where(x => x.CategoryTitle != null)
                                 .GroupBy(x => x.CategoryTitle))
                        sectionGamesPairs.Add(
                            new KeyValuePair<string, List<MobileGameInfo>>(groupItem.Key, groupItem.ToList()));
                }
            }
        }
    }

    private string GetHandledAllGamesBySections(string games, out List<GameAllInfo> allList, string homeLink)
    {
        const string sectioPatternKey = "sectionName";
        var allRegExpPattern = string.Intern($"(?<{sectioPatternKey}>[\\s\\w\\d]+)\\=ALL\\=ALL,*");
        var rxOption = RegexOptions.IgnoreCase | RegexOptions.Multiline;
        allList = new List<GameAllInfo>();
        var regex = new Regex(allRegExpPattern, rxOption);

        foreach (Match match in regex.Matches(games))
        {
            allList.Add(new GameAllInfo
            {
                Link = homeLink,
                SectionTitle = match.Groups[sectioPatternKey].Value,
            });
        }

        if (allList.Count > 0)
        {
            games = Regex.Replace(games, allRegExpPattern, string.Empty, rxOption);
            games = Regex.Replace(games, "\\,\\s*\\]", "]", rxOption);

            // to support old inbox data, when there was different format with { and }
            return Regex.Replace(games, "\\,\\s*\\}", "}", rxOption);
        }

        return games;
    }

    private List<MobileGameInfo> ParseGames(string games)
    {
        List<MobileGameInfo> gameList = null;

        if (!string.IsNullOrEmpty(games))
        {
            try
            {
                gameList = new List<MobileGameInfo>();
                // to support old inbox data, when there was different format with { and }
                var splitGames = games.Replace('}', ' ').Replace('{', ' ').Replace('[', ' ').Replace(']', ' ').Trim().Split(',');

                foreach (var splitGame in splitGames)
                {
                    var gameItem = splitGame.Trim();

                    // skip games for the particular label
                    if (IsGameContainsLabelPrefix(gameItem))
                    {
                        if (!IsGameForCurrentLabel(gameItem))
                        {
                            continue;
                        }

                        // remove label
                        gameItem = gameItem.Substring(gameItem.Split(' ')[0].Length + 1);
                    }

                    // remove litter
                    gameItem = gameItem.Substring(gameItem.IndexOf("= ", StringComparison.Ordinal) + 1).Trim();
                    // title=variantname
                    var game = gameItem.Split('=');

                    if (game.Length > 1)
                    {
                        var mobileGameInfo = new MobileGameInfo()
                        {
                            InternalGameName = game[game.Length - 1],
                            Title = game[game.Length - 2],
                        };
                        if (game.Length == 3)
                            mobileGameInfo.CategoryTitle = game[0];
                        gameList.Add(mobileGameInfo);
                    }
                }
            }
            catch (Exception e)
            {
                log.LogError(e, "Error while parsing {games}", games);
            }
        }

        return gameList;
    }

    private bool IsGameForCurrentLabel(string splitGame) => splitGame.Split(' ')[0].Equals(environmentProvider.CurrentLabel);
    private bool IsGameContainsLabelPrefix(string splitGame) => splitGame.Split(' ').Length > 1 && splitGame.Split(' ')[0].Split('.').Length == 2;
}
