using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Common.Extensions;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.Cache.Services
{
    public interface IInitializeDistributedCacheService
    {
        Task Initialize();
    }

    public class InitializeDistributedCacheService : IInitializeDistributedCacheService
    {
        private readonly ISiteCoreDisplayRuleService _siteCoreDisplayRuleService;
        private readonly IDistributedCacheService _distributedCacheService;
        private readonly ILogger<InitializeDistributedCacheService> _log;
        private readonly IDisplayManagerScreens _displayManagerScreens;
        private readonly IGantryCache _gantryCache;

        public InitializeDistributedCacheService(ISiteCoreDisplayRuleService siteCoreDisplayRuleService,
            IDistributedCacheService distributedCacheService, ILogger<InitializeDistributedCacheService> log,
            IDisplayManagerScreens displayManagerScreens,
            IGantryCache gantryCache)
        {
            _siteCoreDisplayRuleService = siteCoreDisplayRuleService;
            _distributedCacheService = distributedCacheService;
            _log = log;
            _displayManagerScreens = displayManagerScreens;
            _gantryCache = gantryCache;
        }

        public async Task Initialize()
        {
            
            if (_displayManagerScreens.IsMasterGantryEnabled)
            {
                if (_gantryCache.IsScreensCacheEnabled)
                {
                    await InitializeNew();
                }
                else
                {
                    _log.LogInformation($"Screens Cache was disabled due to that Cache was not initializing.");
                }
            }
            else
            {
                await InitializeOld();
            }
           
        }

        private async Task InitializeOld()
        {
            try
            {
                var cacheStatus =
                    await _distributedCacheService.GetCache<string>(ConstantsPropertyValues.CacheInitialized);
                if (cacheStatus != "True")
                {
                    // TODO: Filter displayRuleItems that are older than X days (based on property Updated)
                    List<SiteCoreDisplayRuleItemDetails> displayRuleItems =
                        await _siteCoreDisplayRuleService.GetAllDisplayRuleItems();

                    var rulesGroupByBrand = displayRuleItems.GroupBy(rule => rule.Brand).ToList();
                    AddDataToCache(rulesGroupByBrand, DisplayRuleCacheType.Brand);
                    var brandKeys = rulesGroupByBrand.Where(g => !string.IsNullOrEmpty(g.Key))
                        .Select(g => $"{DisplayRuleCacheType.Brand}_{g.Key}").ToHashSet();

                    var rulesGroupByScreenInShop = displayRuleItems.Where(rule => !rule.IsQuadUpdated)
                        .GroupBy(rule => rule.ScreenInShop.ToString()).ToList();
                    AddDataToCache(rulesGroupByScreenInShop, DisplayRuleCacheType.ScreenInShop);
                    var screenInShopKeys = rulesGroupByScreenInShop.Where(g => !string.IsNullOrEmpty(g.Key))
                        .Select(g => $"{DisplayRuleCacheType.ScreenInShop}_{g.Key}").ToHashSet();


                    var rulesGroupByLocation = displayRuleItems.GroupBy(rule => rule.Location).ToList();
                    AddDataToCache(rulesGroupByLocation, DisplayRuleCacheType.Location);
                    var locationKeys = rulesGroupByLocation.Where(g => !string.IsNullOrEmpty(g.Key))
                        .Select(g => $"{DisplayRuleCacheType.Location}_{g.Key}").ToHashSet();

                    var rulesGroupByShopId = displayRuleItems.GroupBy(rule => rule.ShopId).ToList();
                    AddDataToCache(rulesGroupByShopId, DisplayRuleCacheType.Shop);
                    var shopIdKeys = rulesGroupByShopId.Where(g => !string.IsNullOrEmpty(g.Key))
                        .Select(g => $"{DisplayRuleCacheType.Shop}_{g.Key}").ToHashSet();

                    //below we are creating quad cache
                    var rulesWhichHasQuadUpdate = displayRuleItems.Where(rule => rule.IsQuadUpdated).ToList();
                    var rulesGroupByScreenInShopHaveQuadUpdate = rulesWhichHasQuadUpdate
                        .GroupBy(rule => rule.ScreenInShop.ToString()).ToList();
                    AddDataToCache(rulesGroupByScreenInShopHaveQuadUpdate, DisplayRuleCacheType.QuadOnScreenInShop);
                    var quadOnScreenInShopKeys = rulesGroupByScreenInShopHaveQuadUpdate
                        .Where(g => !string.IsNullOrEmpty(g.Key))
                        .Select(g => g.ToList().GroupBy(rule => rule.DisplayOrder)
                            .Select(gg => $"{DisplayRuleCacheType.QuadOnScreenInShop}_{g.Key}_{gg.Key}"))
                        .SelectMany(keys => keys)
                        .ToHashSet();

                    //Here we are adding all the keys which are created in cache to add the data.
                    await _distributedCacheService.SetAllCacheKeysList(brandKeys.Concat(screenInShopKeys)
                        .Concat(locationKeys).Concat(shopIdKeys).Concat(quadOnScreenInShopKeys).ToHashSet());

                    await _distributedCacheService.SetCache<string>(ConstantsPropertyValues.CacheInitialized, "True");
                }
            }
            catch (Exception e)
            {
                _log.LogError($"Error in Initializing Cache: {e.Message}", e);
            }
        }

        private async Task InitializeNew()
        {
            try
            {
                //Check Cache Initialized already or not.
                var cacheStatus =
                    await _distributedCacheService.GetCache<string>(ConstantsPropertyValues.CacheInitialized);
                if (cacheStatus != "True")
                {
                    //Get Latest Rules from each screen.
                    List<SiteCoreDisplayRuleItemDetails> displayRuleItems =
                        await _siteCoreDisplayRuleService.GetAllDisplayRuleItems();

                    //Preparing Cache Keys and Rules
                    await _distributedCacheService.PrepareCacheKeysAndRules(displayRuleItems);

                    //Initialization Completed
                    await _distributedCacheService.SetCache<string>(ConstantsPropertyValues.CacheInitialized,
                        "True");
                }
            }
            catch (Exception e)
            {
                _log.LogError($"Error in Initializing Cache: {e.Message}", e);
            }
        }

        //Old Gantry no need in new Gantry
        private void AddDataToCache(List<IGrouping<string?, SiteCoreDisplayRuleItemDetails>> rulesGroup, DisplayRuleCacheType displayRuleCacheType)
        {
            if (rulesGroup.Count > 0)
            {
                foreach (var rules in rulesGroup)
                {
                    if (!string.IsNullOrEmpty(rules.Key))
                    {
                        if (displayRuleCacheType == DisplayRuleCacheType.QuadOnScreenInShop)
                        {
                            var rulesGroupByQuad = rules.GroupBy(rule => rule.DisplayOrder).ToList();
                            if (rulesGroupByQuad.Count > 0)
                            {
                                foreach (var quadRules in rulesGroupByQuad)
                                {
                                    _distributedCacheService.SetCacheWithListOfRules(displayRuleCacheType, rules.Key + "_" + quadRules.Key, quadRules.ToList());
                                }
                            }
                        }
                        else
                        {
                            _distributedCacheService.SetCacheWithListOfRules(displayRuleCacheType, rules.Key, rules.ToList());
                        }
                    }
                }
            }
        }


    }
}