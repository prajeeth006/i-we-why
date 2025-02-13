using System.Web;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Frontend.Gantry.Shared.Core.Services.SiteCore
{

    public interface ISiteCoreProfileGantryRuleService
    {
        Task<List<SiteCoreDisplayRuleItemDetails>> GetRulesBasedOnGantryType(PresenceMessage presenceMessage);
    }
    public class SiteCoreProfileGantryRuleService : ISiteCoreProfileGantryRuleService
    {
        private readonly ILogger<SiteCoreProfileGantryRuleService> _log;
        private readonly IGantrySitecoreUrlConfig _sitecoreUrlConfig;

        public SiteCoreProfileGantryRuleService(ILogger<SiteCoreProfileGantryRuleService> log, IGantrySitecoreUrlConfig sitecoreUrlConfig)
        {
            _log = log;
            _sitecoreUrlConfig = sitecoreUrlConfig;
        }

        public async Task<List<SiteCoreDisplayRuleItemDetails>> GetRulesBasedOnGantryType(PresenceMessage presenceMessage)
        {
            List<SiteCoreDisplayRuleItemDetails> matchedDisplayRuleForEachScreenInShop = new List<SiteCoreDisplayRuleItemDetails>();
            
            var result = await GetProfileFromDisplayManagerApi(presenceMessage);
            if (result == null)
            {
                _log.LogError($"Presence message SID: {presenceMessage.Sid} didn't got any rules from display manager api.");
                return matchedDisplayRuleForEachScreenInShop;
            }

            IList<ScreenWithLatestRule>? screenWithLatestRules = JsonConvert.DeserializeObject<IList<ScreenWithLatestRule>>(result);
            _log.LogInformation($"Presence message SID: {presenceMessage.Sid} Got response from api as: {result}");

            if (screenWithLatestRules != null)
                foreach (var screenWithLatestRule in screenWithLatestRules)
                {
                    if (screenWithLatestRule != null)
                    {
                        SiteCoreDisplayRuleItemDetails siteCoreDisplayRuleItemDetails = new SiteCoreDisplayRuleItemDetails();
                            
                        siteCoreDisplayRuleItemDetails.GantryType = screenWithLatestRule.GantryType;
                        siteCoreDisplayRuleItemDetails.ViewGroup = screenWithLatestRule.ViewGroup;
                        siteCoreDisplayRuleItemDetails.ScreenInShop = screenWithLatestRule?.ScreenInShop;
                        siteCoreDisplayRuleItemDetails.ViewId = screenWithLatestRule?.ViewId;
                        siteCoreDisplayRuleItemDetails.ScreenType = screenWithLatestRule?.ScreenType;

                        var siteCoreRule = screenWithLatestRule?.Asset;
                        if (siteCoreRule != null)
                        {
                            siteCoreDisplayRuleItemDetails.DisplayRuleItemId = siteCoreRule.ruleId;
                            siteCoreDisplayRuleItemDetails.TargetItemId = siteCoreRule.targetItemId;
                            siteCoreDisplayRuleItemDetails.TargetItemPath = siteCoreRule.targetItemId;
                            siteCoreDisplayRuleItemDetails.IsStaticPromotion = siteCoreRule.isPromotionTreeNode;
                            siteCoreDisplayRuleItemDetails.IsMultiView = siteCoreRule.isMultiView;
                            siteCoreDisplayRuleItemDetails.IsSportsChannel = siteCoreRule.isSkyChannelTreeNode;
                            siteCoreDisplayRuleItemDetails.IsCarousel = siteCoreRule.isCarousleNode;
                            siteCoreDisplayRuleItemDetails.EventMarketPairs = siteCoreRule.eventMarketPairs;
                            siteCoreDisplayRuleItemDetails.TypeIds = siteCoreRule.typeIds;
                            siteCoreDisplayRuleItemDetails.IsMultiEvent = siteCoreRule.isMultiEventTreeNode;
                            siteCoreDisplayRuleItemDetails.isMisc = siteCoreRule.isMisc;
                            siteCoreDisplayRuleItemDetails.isManualTreeNode = siteCoreRule.isManualTreeNode;
                            siteCoreDisplayRuleItemDetails.contentItemId = siteCoreRule.contentItemId;
                            siteCoreDisplayRuleItemDetails.ContentMediaType = string.IsNullOrEmpty(siteCoreRule.ContentMediaType)?ConstantsPropertyValues.Simple:siteCoreRule.ContentMediaType;
                            siteCoreDisplayRuleItemDetails.ContentProvider = string.IsNullOrEmpty(siteCoreRule.ContentProvider) ? ConstantsPropertyValues.ContentProviderDTP : siteCoreRule.ContentProvider;


                            if (siteCoreRule?.Event != null)
                            {
                                siteCoreDisplayRuleItemDetails.TypeName = siteCoreRule.Event.typeName;
                                siteCoreDisplayRuleItemDetails.CategoryCode = siteCoreRule.Event.categoryCode;
                                siteCoreDisplayRuleItemDetails.ClassName = siteCoreRule.Event.className;
                                siteCoreDisplayRuleItemDetails.EventId = siteCoreRule.Event.id.ToString();
                                siteCoreDisplayRuleItemDetails.TypeId = siteCoreRule.Event.typeId.ToString();
                                siteCoreDisplayRuleItemDetails.MarketIds = new List<Market>();
                                if (siteCoreRule?.Event.markets != null)
                                {
                                    foreach (var market in siteCoreRule.Event.markets)
                                    {
                                        siteCoreDisplayRuleItemDetails.MarketIds.Add(new Market()
                                        {
                                            id = market.id,
                                            name = market.name
                                        });
                                    }
                                }
                                siteCoreDisplayRuleItemDetails.ContentMediaType=string.IsNullOrEmpty(siteCoreRule?.Event.ContentMediaType)? ConstantsPropertyValues.Simple: siteCoreRule?.Event.ContentMediaType;
                                siteCoreDisplayRuleItemDetails.RacingAssetType = siteCoreRule?.Event?.racingAssetType;
                                getSplitScreenValues(siteCoreRule?.Event?.splitScreen);
                                siteCoreDisplayRuleItemDetails.SplitScreen = siteCoreRule?.Event?.splitScreen;
                                siteCoreDisplayRuleItemDetails.TradingPartitionId =
                                    siteCoreRule?.Event?.tradingPartitionId;
                                siteCoreDisplayRuleItemDetails.ContentProvider = string.IsNullOrEmpty(siteCoreRule?.Event.ContentProvider) ? ConstantsPropertyValues.ContentProviderDTP : siteCoreRule?.Event.ContentProvider;

                            }
                        }
                        matchedDisplayRuleForEachScreenInShop.Add(siteCoreDisplayRuleItemDetails);
                    }
                }

            if (screenWithLatestRules?.Count(x => x.Asset != null) == 0)
            {
                _log.LogError($"Presence message SID: {presenceMessage.Sid} Rules are not there because there are no drag and drop or it has wrong gantryType {presenceMessage?.Sender?.groups} in presenceMessage");
            }
            return matchedDisplayRuleForEachScreenInShop;
        }


        private async Task<string?> GetProfileFromDisplayManagerApi(PresenceMessage presenceMessage)
        {
            try
            {
                if (presenceMessage?.Sender?.groups != null)
                {

                    _log.LogInformation($"Presence message SID: {presenceMessage.Sid} calling display manager api.");

                    string gantryTypes = string.Join(",", presenceMessage.Sender.groups);
                    string? urlParams =
                        _sitecoreUrlConfig.GetProfileForPresenceMessage?.Replace("<currentLabel>", presenceMessage.Sender.brand)?.Replace("<gantryTypenames>", HttpUtility.UrlEncode(gantryTypes));

                    string profileUrl = $"{_sitecoreUrlConfig.SiteCoreBaseUrl}{urlParams}";
                    using (HttpClient client = new HttpClient())
                    using (HttpResponseMessage response = await client.GetAsync(profileUrl))
                    using (HttpContent content = response.Content)
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            _log.LogInformation($"Presence message SID: {presenceMessage.Sid} gor response from display manager api: {profileUrl}");
                            return await content.ReadAsStringAsync();
                        }
                        else
                        {
                            string responseMessage = await content.ReadAsStringAsync();
                            _log.LogError($"Presence message SID: {presenceMessage.Sid} gor invalid response from display manager api: {profileUrl} as message : {responseMessage}");
                            return null;
                        }
                    }
                }
                
            }
            catch (Exception ex)
            {
                _log.LogError($"Presence message SID: {presenceMessage?.Sid} Unable to get rules from DisplayManager api", ex);
            }

            return null;

        }
        private void getSplitScreenValues(SplitScreen splitScreen)
        {
            if (splitScreen == null) return;
            splitScreen.splitScreenStartRange = splitScreen?.splitScreenStartRange == 0 ? null :splitScreen?.splitScreenStartRange;
            splitScreen.maxRunnerCount = splitScreen?.maxRunnerCount == 0 ? null : splitScreen?.maxRunnerCount;
            splitScreen.splitScreenEndRange = splitScreen?.splitScreenEndRange == 0 ? null : splitScreen?.splitScreenEndRange;
            splitScreen.splitScreenPageNo = splitScreen?.splitScreenPageNo == 0 ? null : splitScreen?.splitScreenPageNo;
            splitScreen.splitScreenTotalPages = splitScreen?.splitScreenTotalPages == 0 ? null :splitScreen?.splitScreenTotalPages;
        }
    }
}
