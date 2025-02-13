using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.BusinessLogic.Cache;
using Frontend.Gantry.Shared.Core.BusinessLogic.Cache.Services;
using Frontend.Gantry.Shared.Core.BusinessLogic.ContentServices;
using Frontend.Gantry.Shared.Core.BusinessLogic.CreateUrl;
using Frontend.Gantry.Shared.Core.BusinessLogic.Helpers;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.Kafka;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.BusinessLogic
{
    public interface IKafkaSiteCoreMessageProcessor
    {
        Task ProcessSiteCoreItemDetails(
            SiteCoreItemDetailsMessage siteCoreItemDetailsMessage);
    }

    public class KafkaSiteCoreMessageProcessor : IKafkaSiteCoreMessageProcessor
    {
        private readonly IRtmsKafkaProducerService _rtmsKafkaProducerService;
        private readonly ILogger<KafkaSiteCoreMessageProcessor> _log;
        private readonly ISiteCoreDisplayRuleService _siteCoreDisplayRuleService;
        private readonly IGantryUrlService _gantryUrlService;
        private readonly ISiteCoreContentService _siteCoreContentService;
        private readonly IDistributedCacheService _distributedCacheService;
        private readonly IDisplayRulesService _displayRulesService;
        private readonly IMultiViewService _multiViewService;
        private readonly IScreenType _screenType;
        private readonly IDisplayManagerScreens _displayManagerScreens;
        private readonly IGantryCache _gantryCache;

        public KafkaSiteCoreMessageProcessor(
            IRtmsKafkaProducerService rtmsKafkaProducerService,
            ISiteCoreDisplayRuleService siteCoreDisplayRuleService,
            ILogger<KafkaSiteCoreMessageProcessor> log,
            IGantryUrlService gantryUrlService, 
            ISiteCoreContentService siteCoreContentService,
            IDistributedCacheService distributedCacheService,
            IDisplayRulesService displayRulesService,
            IMultiViewService multiViewService, 
            IScreenType screenType, 
            IDisplayManagerScreens displayManagerScreens,
            IGantryCache gantryCache)
        {
            _rtmsKafkaProducerService = rtmsKafkaProducerService;
            _siteCoreDisplayRuleService = siteCoreDisplayRuleService;
            _log = log;
            _gantryUrlService = gantryUrlService;
            _siteCoreContentService = siteCoreContentService;
            _distributedCacheService = distributedCacheService;
            _displayRulesService = displayRulesService;
            _multiViewService = multiViewService;
            _screenType = screenType;
            _displayManagerScreens = displayManagerScreens;
            _gantryCache = gantryCache;
        }

        public async Task ProcessSiteCoreItemDetails(SiteCoreItemDetailsMessage? siteCoreItemDetailsMessage)
        {
            if (_displayManagerScreens.IsMasterGantryEnabled)
            {
                await ProcessSiteCoreItemDetailsNew(siteCoreItemDetailsMessage);
            }
            else
            {
                await ProcessSiteCoreItemDetailsOld(siteCoreItemDetailsMessage);
            }
        }

        public async Task ProcessSiteCoreItemDetailsOld(SiteCoreItemDetailsMessage? siteCoreItemDetailsMessage)
        {
            try
            {
                try
                {
                    siteCoreItemDetailsMessage.ItemId =
                        (new Guid(siteCoreItemDetailsMessage.ItemId)).ToString("D").ToLower();
                }
                catch (Exception)
                {
                    _log.LogError(
                        $"ProcessSiteCoreItem kafka message: ProcessSiteCoreItem kafka message: Invalid ItemId present in Site Core Kafka Message");
                }

                if (siteCoreItemDetailsMessage?.Operation?.ToLower().Trim().Equals(ConstantsPropertyValues.Delete) ?? false)
                {
                    _log.LogError(
                        $"ProcessSiteCoreItem kafka message: Site Core Kafka Message: {JsonConvert.SerializeObject(siteCoreItemDetailsMessage)} and skipping due to Delete operation received.");
                }
                else
                {
                    SiteCoreDisplayRuleItemDetails? displayRule =
                        await _siteCoreDisplayRuleService.GetDisplayRuleItem(siteCoreItemDetailsMessage.ItemId);

                    //Ravi: Below condition is important. Please dont remove this. Otherwise we will end up sending empty messages to RTMS kafka.
                    if (displayRule == null)
                    {
                        _log.LogError(
                            $"Display rule with these properties not found: ItemId '{siteCoreItemDetailsMessage.ItemId}', Path '{siteCoreItemDetailsMessage.Path}'");
                        return;
                    }

                    bool isRuleAlreadyProcessed = await _displayRulesService.IsDisplayRuleAlreadyProcessed(displayRule);
                    if (isRuleAlreadyProcessed)
                    {
                        _log.LogInformation(
                            $"Display rule with these properties: '{displayRule.Brand} and Rule ItemId {displayRule.DisplayRuleItemId}' is Already Processed.");
                        return;
                    }

                    //here we will check if display rule is of sports channel or of screen.
                    if (displayRule.IsSportsChannel)
                    {
                        ISportsChannels sportsChannels = await _siteCoreContentService.GetContent<ISportsChannels>(displayRule.TargetItemId);
                        if (sportsChannels != null)
                        {
                            RtmsSportsChannelMessageDetails rtmsSportsMessageDetailsMessage = KafkaMessageHelper.CreateRtmsSportsChannelMessageDetails(displayRule, sportsChannels);

                            _log.LogInformation($"Display Rule SportsChannelItemId: {displayRule.TargetItemId}");
                            await _rtmsKafkaProducerService.ProduceMessageToKafka(rtmsSportsMessageDetailsMessage);
                        }
                    }
                    else
                    {
                        RtmsMessageDetailsMessage rtmsMessageDetailsMessage;
                        if (displayRule.IsMultiView)
                        {
                            var multiviewUrls = await _multiViewService.GetUrls(displayRule.TargetItemId);
                            foreach (var multiviewUrl in multiviewUrls)
                            {
                                multiviewUrl.Url = new Uri(_screenType.SetScreenType(new GantryScreens() { screenType = ConstantsPropertyValues.Quad }, multiviewUrl.Url?.ToString()));
                            }
                            rtmsMessageDetailsMessage = KafkaMessageHelper.CreateRtmsMessage(displayRule, multiviewUrls);
                        }
                        else
                        {
                            string replacedPlaceHolderInUrl = await _gantryUrlService.PrepareUrl(displayRule);
                            replacedPlaceHolderInUrl = _screenType.SetScreenType(new GantryScreens() { screenType = displayRule.IsQuadUpdated ? ConstantsPropertyValues.Quad : ConstantsPropertyValues.Full }, replacedPlaceHolderInUrl);
                            rtmsMessageDetailsMessage = KafkaMessageHelper.CreateRtmsMessage(displayRule, replacedPlaceHolderInUrl);
                        }

                        _log.LogInformation($"Display Rule ItemId: {displayRule.TargetItemId}");
                        await _rtmsKafkaProducerService.ProduceMessageToKafka(rtmsMessageDetailsMessage);
                    }
                    _log.LogInformation($"ProcessSiteCoreItem kafka message: Adding display rule to cache {displayRule} ");
                    await _distributedCacheService.SetOrUpdateInAllCacheForOneRule(displayRule);
                }
            }
            catch (Exception e)
            {
                _log.LogError(e, e.Message);
            }
        }

        public async Task ProcessSiteCoreItemDetailsNew(SiteCoreItemDetailsMessage? siteCoreItemDetailsMessage)
        {
            try
            {
                DateTime startTime = DateTime.UtcNow;
                try
                {
                    siteCoreItemDetailsMessage.ItemId =
                        (new Guid(siteCoreItemDetailsMessage.ItemId)).ToString("D").ToLower();
                }
                catch (Exception)
                {
                    _log.LogError(
                        $"ProcessSiteCoreItem kafka message: ProcessSiteCoreItem kafka message: Invalid ItemId present in Site Core Kafka Message");
                }

                _log.LogInformation(
                    $"ProcessSiteCoreItem kafka message: Site Core Kafka Message: {JsonConvert.SerializeObject(siteCoreItemDetailsMessage)}");

                if (siteCoreItemDetailsMessage?.Operation?.ToLower().Trim().Equals(ConstantsPropertyValues.Delete) ?? false)
                {
                    _log.LogError(
                        $"ProcessSiteCoreItem kafka message: Site Core Kafka Message: {JsonConvert.SerializeObject(siteCoreItemDetailsMessage)} and skipping due to Delete operation received.");
                }
                else
                {
                    SiteCoreDisplayRuleItemDetails? displayRule =
                        await _siteCoreDisplayRuleService.GetDisplayRuleItem(siteCoreItemDetailsMessage.ItemId);

                    _log.LogInformation($"ProcessSiteCoreItem kafka message: Rule got and verified from sitecore: {JsonConvert.SerializeObject(displayRule)} with Latency : {(DateTime.UtcNow - startTime).TotalMilliseconds}");

                    //Ravi: Below condition is important. Please dont remove this. Otherwise we will end up sending empty messages to RTMS kafka.
                    if (displayRule == null)
                    {
                        _log.LogError(
                            $"ProcessSiteCoreItem kafka message: Display rule with these properties not found: ItemId '{siteCoreItemDetailsMessage.ItemId}', Path '{siteCoreItemDetailsMessage.Path}'");
                        return;
                    }

                    bool isRuleAlreadyProcessed = await _displayRulesService.IsDisplayRuleAlreadyProcessed(displayRule);
                    if (isRuleAlreadyProcessed)
                    {
                        _log.LogInformation($"ProcessSiteCoreItem kafka message:Display rule with these properties: '{displayRule.Brand} and Rule ItemId {displayRule.DisplayRuleItemId}' is Already Processed.");
                        return;
                    }

                    if (displayRule?.GantryScreens != null)
                    {

                        if (displayRule.GantryScreens.Count <= 0)
                        {
                            _log.LogInformation($"ProcessSiteCoreItem kafka message: No Gantry Mappings found for this Rule {JsonConvert.SerializeObject(displayRule)}");
                            return;
                        }

                        foreach (GantryScreens gantryScreen in displayRule.GantryScreens)
                        {

                            if (gantryScreen == null)
                            {
                                _log.LogError($"ProcessSiteCoreItem kafka message: Couldn't found gantryScreen object {JsonConvert.SerializeObject(displayRule)}");
                            }
                            else
                            {
                                //here we will check if display rule is of sports channel or of screen.
                                if (displayRule.IsSportsChannel)
                                {
                                    ISportsChannels sportsChannels = await _siteCoreContentService.GetContent<ISportsChannels>(displayRule.TargetItemId);
                                    if (sportsChannels != null)
                                    {
                                        RtmsSportsChannelMessageDetails rtmsSportsMessageDetailsMessage = KafkaMessageHelper.CreateRtmsSportsChannelMessageDetails(displayRule, sportsChannels, new[] { gantryScreen?.screenTypeId });

                                        _log.LogInformation($"ProcessSiteCoreItem kafka message: Prepared RTMS Message:  {JsonConvert.SerializeObject(rtmsSportsMessageDetailsMessage)}");

                                        await _rtmsKafkaProducerService.ProduceMessageToKafka(rtmsSportsMessageDetailsMessage);
                                    }
                                }
                                else
                                {
                                    RtmsMessageDetailsMessage rtmsMessageDetailsMessage;

                                    string replacedPlaceHolderInUrl = await _gantryUrlService.PrepareUrl(displayRule);
                                    replacedPlaceHolderInUrl = _screenType.SetScreenType(gantryScreen, replacedPlaceHolderInUrl);
                                    rtmsMessageDetailsMessage = KafkaMessageHelper.CreateRtmsMessage(displayRule, replacedPlaceHolderInUrl, gantryScreen);

                                    _log.LogInformation($"ProcessSiteCoreItem kafka message: Prepared RTMS Message: {JsonConvert.SerializeObject(rtmsMessageDetailsMessage)}");
                                    await _rtmsKafkaProducerService.ProduceMessageToKafka(rtmsMessageDetailsMessage);
                                }

                                _log.LogInformation($"ProcessSiteCoreItem kafka message: Kafka message processed for Rule : {JsonConvert.SerializeObject(displayRule)} with Latency : {(DateTime.UtcNow - startTime).TotalMilliseconds}");
                            }
                        }

                        if (_gantryCache.IsScreensCacheEnabled)
                        {
                            _log.LogInformation($"ProcessSiteCoreItem kafka message: Adding display rule to cache {JsonConvert.SerializeObject(displayRule)}");
                            var rulesToPushIntoCache = _siteCoreDisplayRuleService.PreparedRulesSpecificToGantryType(displayRule);
                            await _distributedCacheService.UpdateCacheWithLatestRules(rulesToPushIntoCache);
                        }

                        //Creating new Cache Key as Site Core new rule item Id with Data.
                        _log.LogInformation($"ProcessSiteCoreItem kafka message: Updating Cache with new Rule");
                        await _distributedCacheService.SetCacheWithRule(DisplayRuleCacheType.DisplayRuleItem, displayRule.DisplayRuleItemId, displayRule);

                        _log.LogInformation($"ProcessSiteCoreItem kafka message: Completed ProcessSiteCoreItem with Latency : {(DateTime.UtcNow - startTime).TotalMilliseconds}");
                    }
                }
            }
            catch (Exception e)
            {
                _log.LogError(e, e.Message);
            }
        }

    }
}