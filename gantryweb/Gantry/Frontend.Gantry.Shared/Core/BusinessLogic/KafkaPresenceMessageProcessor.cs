using Frontend.Gantry.Shared.Configuration;
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
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.BusinessLogic
{
    public interface IKafkaPresenceMessageProcessor
    {
        Task ProcessPresenceMessage(PresenceMessage presenceMessage);
    }

    public class KafkaPresenceMessageProcessor : IKafkaPresenceMessageProcessor
    {
        private readonly IRtmsKafkaProducerService _rtmsKafkaProducerService;
        private readonly IDisplayRulesService _displayRulesService;
        private readonly IDistributedCacheService _distributedCacheService;
        private readonly IInitializeDistributedCacheService _initializeDistributedCacheService;
        private readonly IGantryUrlService _gantryUrlService;
        private readonly ISiteCoreProfileGantryRuleService _siteCoreProfileGantryRuleService;
        private readonly IMultiViewService _multiViewService;
        private readonly ILogger<KafkaPresenceMessageProcessor> _log;
        private readonly IScreenType _screenType;
        private readonly IDisplayManagerScreens _displayManagerScreens;

        public KafkaPresenceMessageProcessor(
            IRtmsKafkaProducerService rtmsKafkaProducerService,
            IGantryUrlService gantryUrlService,
            ILogger<KafkaPresenceMessageProcessor> log, IDisplayRulesService displayRulesService, IDistributedCacheService distributedCacheService, IInitializeDistributedCacheService initializeDistributedCacheService, IMultiViewService multiViewService, IScreenType screenType, ISiteCoreProfileGantryRuleService siteCoreProfileGantryRuleService, IDisplayManagerScreens displayManagerScreens)
        {
            _rtmsKafkaProducerService = rtmsKafkaProducerService;
            _gantryUrlService = gantryUrlService;
            _log = log;
            _displayRulesService = displayRulesService;
            _distributedCacheService = distributedCacheService;
            _initializeDistributedCacheService = initializeDistributedCacheService;
            _multiViewService = multiViewService;
            _screenType = screenType;
            _siteCoreProfileGantryRuleService = siteCoreProfileGantryRuleService;
            _displayManagerScreens = displayManagerScreens;
        }

        public async Task ProcessPresenceMessage(PresenceMessage presenceMessage)
        {
            if (_displayManagerScreens.IsMasterGantryEnabled)
            {
                await ProcessPresenceMessageNew(presenceMessage);
            }
            else
            {
                await ProcessPresenceMessageOld(presenceMessage);
            }
            
        }

        public async Task ProcessPresenceMessageOld(PresenceMessage presenceMessage)
        {
            try
            {
                _log.LogInformation($"Starting Presence message SID: {presenceMessage.Sid} at  TimeStamp:{DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}");
                List<ScreenGroup> screenGroups = new List<ScreenGroup>();
                var cacheStatus = await _distributedCacheService.GetCache<string>(ConstantsPropertyValues.CacheInitialized);
                if (cacheStatus != "True")
                {
                    _log.LogInformation($"Presence message SID: {presenceMessage.Sid}, Initializing cache at TimeStamp:{DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}");
                    await _initializeDistributedCacheService.Initialize();
                    _log.LogInformation($"Presence message SID: {presenceMessage.Sid}, Cache initialized at TimeStamp:{DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}");
                }

                _log.LogInformation($"Presence message SID: {presenceMessage.Sid}, Preparing all rules from cache at TimeStamp:{DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}");

                //Get the latest rule for each screen.
                List<SiteCoreDisplayRuleItemDetails> matchedDisplayRuleForEachScreenInShop = await _displayRulesService.GetLatestMatchingRuleForEachScreenInShop(presenceMessage);

                //Get all the quad updates rules. Needed this as vanilla is caching rules and we are not getting latest.
                List<SiteCoreDisplayRuleItemDetails> matchedDisplayRuleForEachQuadOnScreenInShop = matchedDisplayRuleForEachScreenInShop.FindAll(rule => rule.IsQuadUpdated);

                matchedDisplayRuleForEachScreenInShop.RemoveAll(rule => rule.IsQuadUpdated);

                _log.LogInformation($"Presence message SID: {presenceMessage.Sid}, All rules prepared from cache at TimeStamp:{DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}");

                if (matchedDisplayRuleForEachScreenInShop?.Count > 0)
                {
                    foreach (var rule in matchedDisplayRuleForEachScreenInShop)
                    {
                        if (rule != null)
                        {
                            if (rule.IsMultiView)
                            {
                                _log.LogInformation($"Presence message SID: {presenceMessage.Sid},Trying to get Multiview Urls for ItemId {rule.TargetItemId} at TimeStamp:{DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}");

                                var multiviewUrls = await _multiViewService.GetUrls(rule.TargetItemId);

                                _log.LogInformation($"Presence message SID: {presenceMessage.Sid},Got all Multiview urls for ItemId {rule.TargetItemId} at TimeStamp:{DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}");


                                GetLatestMultiviewUrls(multiviewUrls, matchedDisplayRuleForEachQuadOnScreenInShop,
                                    rule.ScreenInShop);

                                var multiviewScreenGroups = KafkaMessageHelper.CreateScreenGroupsForMultiViewUrls(multiviewUrls, rule.ScreenInShop);
                                if (multiviewScreenGroups?.Count > 0)
                                {
                                    screenGroups = screenGroups.Concat(multiviewScreenGroups).ToList();
                                }

                                _log.LogInformation($"Presence message SID: {presenceMessage.Sid}, Prepared screen groups for {rule.TargetItemId} at TimeStamp:{DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}");
                            }
                            else if (!rule.IsQuadUpdated)
                            {
                                string replacedPlaceHolderInUrl = await _gantryUrlService.PrepareUrl(rule);
                                replacedPlaceHolderInUrl = _screenType.SetScreenType(
                                    new GantryScreens() { screenType = ConstantsPropertyValues.Full }, replacedPlaceHolderInUrl);
                                screenGroups.Add(new ScreenGroup
                                {
                                    screenId = rule.ScreenInShop,
                                    templateUrl = replacedPlaceHolderInUrl,
                                    viewGroup = ConstantsPropertyValues.Single
                                });
                            }
                        }
                    }
                }
                else
                {
                    _log.LogError($"There are no rules for any screen for this presence message {JsonConvert.SerializeObject(presenceMessage)} ");
                }

                RtmsMessageDetailsMessage rtmsMessageDetailsMessage = KafkaMessageHelper.CreateRtmsMessage(presenceMessage);
                rtmsMessageDetailsMessage.msg.payload.screenGroups = screenGroups;
                rtmsMessageDetailsMessage.target.groups = null;
                await _rtmsKafkaProducerService.ProduceMessageToKafka(rtmsMessageDetailsMessage/*, producerConfig, topicsToPushMessages*/);
            }
            catch (Exception e)
            {
                _log.LogError(e, e.Message);
            }
        }
        public async Task ProcessPresenceMessageNew(PresenceMessage presenceMessage)
        {
            try
            {
                List<ScreenGroup> screenGroups = new List<ScreenGroup>();
                DateTime startTime = DateTime.UtcNow;

                if (presenceMessage?.Sender?.groups != null)
                {
                    string gantryTypes = string.Join(",", presenceMessage?.Sender?.groups);
                    _log.LogInformation($"Presence message SID: {presenceMessage.Sid}, getting Screen Groups from Cache at TimeStamp:{DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}");
                    screenGroups = await _distributedCacheService.GetCache<List<ScreenGroup>>(
                        $"{DisplayRuleCacheType.PresenceMessage}_{gantryTypes}");
                    _log.LogInformation(
                        $"Presence message SID: {presenceMessage.Sid}, completed getting Screen Groups fromCache initialized at TimeStamp:{DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}");

                    if (screenGroups == null || screenGroups?.Count <= 0)
                    {
                        DateTime startTimeToGetFromApi = DateTime.UtcNow;
                        _log.LogInformation(
                            $"Presence message SID: {presenceMessage.Sid} Starting at  TimeStamp:{DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}");
                        List<SiteCoreDisplayRuleItemDetails> matchedDisplayRuleForEachScreenInShop =
                            await _siteCoreProfileGantryRuleService.GetRulesBasedOnGantryType(presenceMessage);
                        _log.LogInformation(
                            $"Presence message SID: {presenceMessage.Sid}, All rules got from api at TimeStamp:{DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)} with latency {(DateTime.UtcNow - startTimeToGetFromApi).TotalMilliseconds}");

                        if (matchedDisplayRuleForEachScreenInShop?.Count > 0)
                        {
                            screenGroups = new List<ScreenGroup>();
                            foreach (var rule in matchedDisplayRuleForEachScreenInShop)
                            {
                                if (rule != null)
                                {
                                    _log.LogInformation(
                                        $"Presence message SID: {presenceMessage.Sid},Trying to get Urls for ItemId {rule.TargetItemId} at TimeStamp:{DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}");
                                    string replacedPlaceHolderInUrl = await _gantryUrlService.PrepareUrl(rule);
                                    replacedPlaceHolderInUrl = _screenType.SetScreenType(
                                        new GantryScreens() { screenType = rule.ScreenType }, replacedPlaceHolderInUrl);
                                    screenGroups.Add(new ScreenGroup
                                    {
                                        screenId = rule.ScreenInShop,
                                        templateUrl = replacedPlaceHolderInUrl,
                                        viewGroup = rule.ViewGroup,
                                        viewId = rule.ViewId
                                    });
                                }
                            }
                        }
                        else
                        {
                            _log.LogError(
                                $"Presence message SID: {presenceMessage.Sid} There are no rules for any screen for this presence message {JsonConvert.SerializeObject(presenceMessage)} ");
                        }
                    }


                    RtmsMessageDetailsMessage rtmsMessageDetailsMessage =
                        KafkaMessageHelper.CreateRtmsMessage(presenceMessage);
                    rtmsMessageDetailsMessage.msg.payload.screenGroups = screenGroups;

                    rtmsMessageDetailsMessage.target.groups = null;

                    _log.LogInformation(
                        $"Presence message SID: {presenceMessage.Sid}, presence message prepared with {JsonConvert.SerializeObject(presenceMessage)}");
                    await _rtmsKafkaProducerService.ProduceMessageToKafka(
                        rtmsMessageDetailsMessage /*, producerConfig, topicsToPushMessages*/);
                    _log.LogInformation(
                        $"Presence message SID: {presenceMessage.Sid}, presence message completed with Message : {JsonConvert.SerializeObject(rtmsMessageDetailsMessage)} with Latency: {(DateTime.UtcNow - startTime).TotalMilliseconds}");

                    await _distributedCacheService.SetCacheForPresenceMessage(DisplayRuleCacheType.PresenceMessage, gantryTypes, screenGroups);
                }
                else
                {
                    _log.LogError(
                        $"Presence message SID: {presenceMessage.Sid}, presence message contain invalid groups {JsonConvert.SerializeObject(presenceMessage)}");
                }

            }
            catch (Exception e)
            {
                _log.LogError(e, e.Message);
            }
        }


        //Old Gantry no need in new Gantry
        private async void GetLatestMultiviewUrls(IList<MultiViewUrl> multiviewUrls, List<SiteCoreDisplayRuleItemDetails> matchedDisplayRuleForEachQuadOnScreenInShop, int? screen)
        {
            if (multiviewUrls?.Count > 0 && matchedDisplayRuleForEachQuadOnScreenInShop?.Count > 0)
            {
                foreach (var multiviewUrl in multiviewUrls)
                {
                    var quadUpdateRule = matchedDisplayRuleForEachQuadOnScreenInShop.Find(rule =>
                        rule.ScreenInShop == screen && rule.DisplayOrder == multiviewUrl.DisplayOrder);

                    if (quadUpdateRule != null && quadUpdateRule.Updated > multiviewUrl.LastUpdated)
                    {
                        var url = await _gantryUrlService.PrepareUrl(quadUpdateRule);
                        if (Uri.TryCreate(url, UriKind.Absolute, out Uri result))
                        {
                            multiviewUrl.Url = result;
                            multiviewUrl.LastUpdated = quadUpdateRule.Updated;
                        }
                    }

                    multiviewUrl.Url = new Uri(_screenType.SetScreenType(new GantryScreens() { screenType = ConstantsPropertyValues.Quad }, multiviewUrl?.Url?.ToString()));
                }
            }
        }

    }
}