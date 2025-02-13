using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.BusinessLogic.Cache;
using Frontend.Gantry.Shared.Core.BusinessLogic.Cache.Services;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.BusinessLogic
{
    public interface IDisplayRulesService
    {
        //Old Gantry no need in new Gantry
        Task<List<SiteCoreDisplayRuleItemDetails>> GetLatestMatchingRuleForEachScreenInShop(
            PresenceMessage presenceMessage);
        Task<bool> IsDisplayRuleAlreadyProcessed(SiteCoreDisplayRuleItemDetails? displayRule);

        Task<SiteCoreDisplayRuleItemDetails> GetDisplayRuleByItemKey(string ruleId);

        Task<List<SiteCoreDisplayRuleItemDetails>> GetLatestMatchingRuleForBrand(PresenceMessage presenceMessage);
    }

    public class DisplayRulesService : IDisplayRulesService
    {
        private readonly IDistributedCacheService _distributedCacheService;
        private readonly ILogger<DisplayRulesService> _log;
        private readonly IDisplayManagerScreens _displayManagerScreens;

        public DisplayRulesService(IDistributedCacheService distributedCacheService, ILogger<DisplayRulesService> log, IDisplayManagerScreens displayManagerScreens)
        {
            _distributedCacheService = distributedCacheService;
            _log = log;
            _displayManagerScreens = displayManagerScreens;
        }

        public async Task<bool> IsDisplayRuleAlreadyProcessed(SiteCoreDisplayRuleItemDetails displayRule)
        {
            if (_displayManagerScreens.IsMasterGantryEnabled)
            {
                return await IsDisplayRuleAlreadyProcessedNew(displayRule);
            }
            else
            {
                return await IsDisplayRuleAlreadyProcessedOld(displayRule);
            }
        }


        public async Task<bool> IsDisplayRuleAlreadyProcessedOld(SiteCoreDisplayRuleItemDetails displayRule)
        {
            try
            {
                bool isDisplayRuleAlreadyProcessed = false;
                var keys = await _distributedCacheService.GetCache<HashSet<string>>(ConstantsPropertyValues.AllCacheKeys);

                var brandKeys = keys?.ToList().FindAll(k => k.Contains($"{DisplayRuleCacheType.Brand.ToString()}_{displayRule?.Brand}"));

                if (brandKeys?.Count > 0)
                {
                    foreach (var key in brandKeys)
                    {
                        var rules = await _distributedCacheService.GetCache<List<SiteCoreDisplayRuleItemDetails>>(key);
                        if (rules?.Count > 0)
                        {
                            var isrulePresent = rules.Any(r => r.DisplayRuleItemId != null && r.DisplayRuleItemId.ToLower().Contains(displayRule?.DisplayRuleItemId?.ToLower()));
                            if (isrulePresent)
                            {
                                isDisplayRuleAlreadyProcessed = true;
                                break;
                            }
                        }
                    }
                }

                return isDisplayRuleAlreadyProcessed;
            }
            catch (Exception e)
            {
                _log.LogError($"Not able to process IsDisplayRuleAlreadyProcessed: {e.Message}", e);
                return false;
            }
        }
        public async Task<bool> IsDisplayRuleAlreadyProcessedNew(SiteCoreDisplayRuleItemDetails displayRule)
        {
            try
            {
                SiteCoreDisplayRuleItemDetails cacheItem = await GetDisplayRuleByItemKey(displayRule.DisplayRuleItemId);
                return cacheItem != null;
            }
            catch (Exception e)
            {
                _log.LogError($"Not able to process IsDisplayRuleAlreadyProcessed: {e.Message}", e);
                return false;
            }
        }

        public async Task<SiteCoreDisplayRuleItemDetails> GetDisplayRuleByItemKey(string ruleId)
        {
            Dictionary<string, List<SiteCoreDisplayRuleItemDetails>> displayRules = new Dictionary<string, List<SiteCoreDisplayRuleItemDetails>>();
            SiteCoreDisplayRuleItemDetails rule = await _distributedCacheService.GetCache<SiteCoreDisplayRuleItemDetails>($"{DisplayRuleCacheType.DisplayRuleItem}_{ruleId}");
            return rule;
        }


        public async Task<List<SiteCoreDisplayRuleItemDetails>> GetLatestMatchingRuleForBrand(PresenceMessage presenceMessage)
        {
            try
            {
                List<SiteCoreDisplayRuleItemDetails> result = new List<SiteCoreDisplayRuleItemDetails>();
                var cacheTypeKey = $"{DisplayRuleCacheType.Brand.ToString()}_{presenceMessage.Sender.brand}";
                List<SiteCoreDisplayRuleItemDetails> allScreensCacheLatestRules = await _distributedCacheService.GetCache<List<SiteCoreDisplayRuleItemDetails>>(cacheTypeKey);
                allScreensCacheLatestRules.RemoveAll(x => x.IsSportsChannel || !(presenceMessage?.Sender?.groups != null && presenceMessage.Sender.groups.Contains(x.GantryType)));
                return allScreensCacheLatestRules;
            }
            catch (Exception e)
            {
                _log.LogError($"Not able to get latest matching rule for each screen in shop: {e.Message}", e);
                return null;
            }

        }

        //Old Gantry no need in new Gantry
        public async Task<List<SiteCoreDisplayRuleItemDetails>> GetLatestMatchingRuleForEachScreenInShop(PresenceMessage presenceMessage)
        {
            try
            {
                List<SiteCoreDisplayRuleItemDetails> result = new List<SiteCoreDisplayRuleItemDetails>();
                var keys = await _distributedCacheService.GetCache<HashSet<string>>(ConstantsPropertyValues.AllCacheKeys);

                var screenInShopkeys = keys.ToList().FindAll(k => k.Contains(DisplayRuleCacheType.ScreenInShop.ToString()));

                foreach (var key in screenInShopkeys)
                {
                    var rules = await _distributedCacheService.GetCache<List<SiteCoreDisplayRuleItemDetails>>(key);
                    if (rules?.Count > 0)
                    {
                        var latestRule = rules.OrderByDescending(r => r.Updated)
                            .FirstOrDefault(r => r.Brand == presenceMessage.Sender.brand && !r.IsSportsChannel);
                        if (latestRule != null)
                        {
                            result.Add(latestRule);
                        }
                    }
                }

                return result;
            }
            catch (Exception e)
            {
                _log.LogError($"Not able to get latest matching rule for each screen in shop: {e.Message}", e);
                return null;
            }

        }
    }
}