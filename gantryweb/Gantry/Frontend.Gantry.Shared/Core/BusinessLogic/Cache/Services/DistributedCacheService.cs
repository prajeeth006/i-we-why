using Bwin.Vanilla.Core.Caching.Isolation;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Common.Extensions;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Threading;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.Cache.Services
{
    public interface IDistributedCacheService
    {
        //Old Gantry no need in new Gantry
        Task SetCacheWithListOfRules(DisplayRuleCacheType cacheType, string propertyValue, List<SiteCoreDisplayRuleItemDetails> displayRules);
        //Old Gantry no need in new Gantry
        Task SetAllCacheKeysList(HashSet<string> allCacheKeys);
        //Old Gantry no need in new Gantry
        Task SetOrUpdateInAllCacheForOneRule(SiteCoreDisplayRuleItemDetails displayRule);


        Task SetCacheWithRule(DisplayRuleCacheType cacheType, string? propertyValue, SiteCoreDisplayRuleItemDetails displayRules);
        Task SetCacheForPresenceMessage(DisplayRuleCacheType cacheType, string? propertyValue, List<ScreenGroup> screenGroups);
        Task<T> GetCache<T>(string cacheKey) where T : class;
        Task<T> SetCache<T>(string cacheKey, string value) where T : class;
        Task DeleteItemFromAllCache(string itemId);


        Task PrepareCacheKeysAndRules(List<SiteCoreDisplayRuleItemDetails> displayRuleItems);
        Task UpdateCacheWithLatestRules(List<SiteCoreDisplayRuleItemDetails> displayRulesSpecificToGantryType);
    }

    public class DistributedCacheService : IDistributedCacheService
    {
        private readonly ILabelIsolatedDistributedCache _labelIsolatedDistributedCache;
        private readonly ILogger<DistributedCacheService> _log;
        private readonly IGantryCache _gantryCache;
        private DistributedCacheEntryOptions _cacheOptions;
        private Object _lock = new Object();

        public DistributedCacheService(ILabelIsolatedDistributedCache labelIsolatedDistributedCache, ILogger<DistributedCacheService> log, IGantryCache gantryCache)
        {
            _labelIsolatedDistributedCache = labelIsolatedDistributedCache;
            _log = log;
            _gantryCache = gantryCache;
        }

        public async Task<T> SetCache<T>(string cacheKey, string value) where T : class
        {
            try
            {
                _cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpiration = DateTimeOffset.Now.AddHours(_gantryCache.AbsoluteExpiration),
                    SlidingExpiration = TimeSpan.FromHours(_gantryCache.SlidingExpiration)
                };
                await _labelIsolatedDistributedCache.SetAsync(cacheKey, ConvertListToByteArray(value), _cacheOptions, CancellationToken.None);
            }
            catch (Exception e)
            {
                _log.LogError($"Error in updating cache for this key: {cacheKey}, value : {value}", e);
            }

            return null;
        }


        public async Task<T> GetCache<T>(string cacheKey) where T : class
        {
            try
            {
                var byteArray = await _labelIsolatedDistributedCache.GetAsync(cacheKey, CancellationToken.None);

                if (byteArray != null)
                {
                    return ConvertByteArrayToList<T>(byteArray);
                }
            }
            catch (Exception e)
            {
                _log.LogError($"Error in getting cache for this key: {cacheKey}", e);
            }

            return null;
        }


        private void AddDataToCache(List<IGrouping<string?, SiteCoreDisplayRuleItemDetails>> rulesGroup, DisplayRuleCacheType displayRuleCacheType)
        {
            if (rulesGroup.Count > 0)
            {
                foreach (var rules in rulesGroup)
                {
                    if (!string.IsNullOrEmpty(rules.Key))
                    {
                        SetCacheWithListOfRules(displayRuleCacheType, rules.Key, rules.ToList());
                    }
                }
            }
        }


        public async Task SetCacheWithListOfRules(DisplayRuleCacheType cacheType, string propertyValue, List<SiteCoreDisplayRuleItemDetails> displayRules)
        {
            try
            {
                _cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpiration = DateTimeOffset.Now.AddHours(_gantryCache.AbsoluteExpiration),
                    SlidingExpiration = TimeSpan.FromHours(_gantryCache.SlidingExpiration)
                };
                var cacheTypeKey = $"{cacheType.ToString()}_{propertyValue}";

                await _labelIsolatedDistributedCache.SetAsync(cacheTypeKey, ConvertListToByteArray(displayRules), _cacheOptions, CancellationToken.None);
            }
            catch (Exception e)
            {
                _log.LogError($"Error in Updating Cache for list of display rules, where cachetype is: {cacheType} and propertyvalue is: {propertyValue}", e);
            }
        }


        public async Task SetCacheWithRule(DisplayRuleCacheType cacheType, string? propertyValue, SiteCoreDisplayRuleItemDetails displayRules)
        {
            try
            {
                _cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpiration = DateTimeOffset.Now.AddHours(_gantryCache.RuleItemAbsoluteExpiration),
                    SlidingExpiration = TimeSpan.FromHours(_gantryCache.RuleItemSlidingExpiration) 
                };
                var cacheTypeKey = $"{cacheType.ToString()}_{propertyValue}";

                await _labelIsolatedDistributedCache.SetAsync(cacheTypeKey, ConvertListToByteArray(displayRules), _cacheOptions, CancellationToken.None);

                _log.LogInformation($"ProcessSiteCoreItem kafka message: Adding new Rule Item in Cache with key as Rule Item Id:  {displayRules?.DisplayRuleItemId}");
            }
            catch (Exception e)
            {
                _log.LogError($"Error in Updating Cache for list of display rules, where cachetype is: {cacheType} and propertyvalue is: {propertyValue}", e);
            }
        }

        public async Task SetCacheForPresenceMessage(DisplayRuleCacheType cacheType, string? propertyValue, List<ScreenGroup> screenGroups)
        {
            try
            {
                _cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpiration = DateTimeOffset.Now.AddSeconds(_gantryCache.PresenceMessageAbsoluteExpiration),
                    SlidingExpiration = TimeSpan.FromSeconds(_gantryCache.PresenceMessageSlidingExpiration)
                };
                var cacheTypeKey = $"{cacheType.ToString()}_{propertyValue}";

                await _labelIsolatedDistributedCache.SetAsync(cacheTypeKey, ConvertListToByteArray(screenGroups), _cacheOptions, CancellationToken.None);
            }
            catch (Exception e)
            {
                _log.LogError($"Error in Updating Cache for list of presence message screen groups, where cachetype is: {cacheType} and propertyvalue is: {propertyValue}", e);
            }
        }

        public async Task PrepareCacheKeysAndRules(List<SiteCoreDisplayRuleItemDetails> displayRuleItems)
        {
            _log.LogInformation($"Prepaing the cache with following displayRules: {JsonConvert.SerializeObject(displayRuleItems)}");

            IEnumerable<SiteCoreDisplayRuleItemDetails> displayRuleItemsSorted = displayRuleItems.OrderBy(rule => rule.GantryType)
                .ThenBy(rules => rules.ScreenInShop).ThenBy(rules => rules.ViewId);

            //Prepare list of Keys to hold Rules
            var brandKeys = SetRulesGroupByBrand(displayRuleItemsSorted);
            var screenInGantryTypeKeys = SetRulesGroupByGantryType(displayRuleItemsSorted);

            //Store All Keys In Cache.
            await SetAllCacheKeysList(brandKeys.Concat(screenInGantryTypeKeys).ToHashSet());

        }


        public HashSet<string> SetRulesGroupByBrand(IEnumerable<SiteCoreDisplayRuleItemDetails> displayRuleItemsSorted)
        {
            var rulesGroupByBrand = displayRuleItemsSorted.GroupBy(rule => rule.Brand).ToList();
            AddDataToCache(rulesGroupByBrand, DisplayRuleCacheType.Brand);
            var brandKeys = rulesGroupByBrand.Where(g => !string.IsNullOrEmpty(g.Key)).Select(g => $"{DisplayRuleCacheType.Brand}_{g.Key}").ToHashSet();

            return brandKeys;
        }

        public HashSet<string> SetRulesGroupByGantryType(IEnumerable<SiteCoreDisplayRuleItemDetails> displayRuleItemsSorted)
        {
            var rulesGroupByGantryType = displayRuleItemsSorted.GroupBy(rule => rule.GantryType).ToList();
            AddDataToCache(rulesGroupByGantryType, DisplayRuleCacheType.ScreensInGantryType);
            var screenInGantryTypeKeys = rulesGroupByGantryType.Where(g => !string.IsNullOrEmpty(g.Key)).Select(g => $"{DisplayRuleCacheType.ScreensInGantryType}_{g.Key}").ToHashSet();

            return screenInGantryTypeKeys;
        }


        public async  Task UpdateCacheWithLatestRules(List<SiteCoreDisplayRuleItemDetails> displayRulesSpecificToGantryType)
        {
            try
            {
                if (displayRulesSpecificToGantryType.Count > 0)
                {
                    DateTime startTime = DateTime.UtcNow;
                    var cacheTypeKey = $"{DisplayRuleCacheType.Brand.ToString()}_{displayRulesSpecificToGantryType[0].Brand}";
                    _log.LogInformation($"ProcessSiteCoreItem kafka message: Before Updating Cache with Key: {cacheTypeKey}");
                    var currentCacheData = await GetCache<List<SiteCoreDisplayRuleItemDetails>>(cacheTypeKey);
                    currentCacheData = currentCacheData.ToList();
                    _cacheOptions = new DistributedCacheEntryOptions
                    {
                        AbsoluteExpiration = DateTimeOffset.Now.AddHours(_gantryCache.AbsoluteExpiration),
                        SlidingExpiration = TimeSpan.FromHours(_gantryCache.SlidingExpiration)
                    };
                    if (currentCacheData != null)
                    {
                        _log.LogInformation($"ProcessSiteCoreItem kafka message: Before Updating Cache: Rules Count : {currentCacheData.Count} Rules: {JsonConvert.SerializeObject(currentCacheData)}");
                        currentCacheData ??= new List<SiteCoreDisplayRuleItemDetails>();
                        foreach (var displayRule in displayRulesSpecificToGantryType)
                        {
                            currentCacheData.RemoveAll(x =>
                                x.GantryType == displayRule.GantryType && x.ScreenInShop == displayRule.ScreenInShop && x.ViewId == displayRule.ViewId);

                            currentCacheData.Add(displayRule);
                        }
                        _log.LogInformation($"ProcessSiteCoreItem kafka message: After Updating Cache: Rules Count : {currentCacheData.Count} Rules: {JsonConvert.SerializeObject(currentCacheData)}");
                    }
                    _log.LogInformation($"ProcessSiteCoreItem kafka message: Updating Cache latency: {(DateTime.UtcNow - startTime).TotalMilliseconds}");
                    await PrepareCacheKeysAndRules(currentCacheData);
                }
            }
            catch (Exception e)
            {
                _log.LogError($"Error in Updating Cache for this display rules", e);
            }
        }

        public async Task SetAllCacheKeysList(HashSet<string> allCacheKeys)
        {
            try
            {
                _cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpiration = DateTimeOffset.Now.AddHours(_gantryCache.AbsoluteExpiration),
                    SlidingExpiration = TimeSpan.FromHours(_gantryCache.SlidingExpiration)
                };
                await _labelIsolatedDistributedCache.SetAsync(ConstantsPropertyValues.AllCacheKeys, ConvertListToByteArray(allCacheKeys), _cacheOptions, CancellationToken.None);
            }
            catch (Exception e)
            {
                _log.LogError($"Error in Updating Cache for list of ScreenInShopKeys", e);
            }
        }

        private byte[] ConvertListToByteArray<T>(T cacheDisplayRules) where T : class 
        {
            BinaryFormatter bf = new BinaryFormatter();
            MemoryStream ms = new MemoryStream();
            bf.Serialize(ms, cacheDisplayRules);
            return ms.ToArray();
        }

        private T ConvertByteArrayToList<T>(byte[] arrBytes) where T : class
        {
            MemoryStream memStream = new MemoryStream();
            BinaryFormatter binForm = new BinaryFormatter();
            memStream.Write(arrBytes, 0, arrBytes.Length);
            memStream.Seek(0, SeekOrigin.Begin);
            T cache = (T)binForm.Deserialize(memStream);

            return cache;
        }

        public async Task DeleteItemFromAllCache(string itemId)
        {
            try
            {
                _cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpiration = DateTimeOffset.Now.AddHours(_gantryCache.AbsoluteExpiration),
                    SlidingExpiration = TimeSpan.FromHours(_gantryCache.SlidingExpiration)
                };
                var allKeys = await GetCache<HashSet<string>>(ConstantsPropertyValues.AllCacheKeys);
                if (allKeys?.Count > 0)
                {
                    foreach (var key in allKeys)
                    {
                        var rules = await GetCache<List<SiteCoreDisplayRuleItemDetails>>(key);
                        if (rules?.Count > 0)
                        {
                            var itemsAfterDelete = rules.Where(item =>
                                    item.DisplayRuleItemId != null && !item.DisplayRuleItemId.ToLower().Trim()
                                        .Contains(itemId?.ToLower().Trim() ?? string.Empty)).ToList();
                            if (itemsAfterDelete != null)
                            {
                                _log.LogInformation(
                                    $"Deleting Item: {itemId} from this {key} Cache ");
                                lock (_lock)
                                {
                                    _labelIsolatedDistributedCache.SetAsync(key,
                                        ConvertListToByteArray(itemsAfterDelete),
                                        _cacheOptions, CancellationToken.None);
                                }
                            }

                        }
                    }
                }

                lock (_lock)
                {
                    var cacheTypeKey = $"{DisplayRuleCacheType.DisplayRuleItem}_{itemId}";
                    _labelIsolatedDistributedCache.RemoveAsync(cacheTypeKey);
                }
            }
            catch (Exception e)
            {
                _log.LogError($"Error in Deleting Item from the Distributed Cache: ", e);
            }
        }


        private async Task SetOrUpdateCacheForOneRule(DisplayRuleCacheType cacheType, string? propertyValue, SiteCoreDisplayRuleItemDetails displayRule)
        {
            try
            {
                var cacheTypeKey = $"{cacheType.ToString()}_{propertyValue}";
                var currentCacheData = await GetCache<List<SiteCoreDisplayRuleItemDetails>>(cacheTypeKey);
                _cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpiration = DateTimeOffset.Now.AddHours(_gantryCache.AbsoluteExpiration),
                    SlidingExpiration = TimeSpan.FromHours(_gantryCache.SlidingExpiration)
                };

                if (currentCacheData != null)
                {
                    currentCacheData.Add(displayRule);
                    await _labelIsolatedDistributedCache.SetAsync(cacheTypeKey, ConvertListToByteArray(currentCacheData), _cacheOptions, CancellationToken.None);
                }
                else
                {
                    await _labelIsolatedDistributedCache.SetAsync(cacheTypeKey, ConvertListToByteArray(new List<SiteCoreDisplayRuleItemDetails> { displayRule }), _cacheOptions, CancellationToken.None);
                }
            }
            catch (Exception e)
            {
                _log.LogError($"Error in Updating Cache for this display rule: {displayRule}", e);
            }
        }

        //Old Gantry no need in new Gantry
        public async Task SetOrUpdateInAllCacheForOneRule(SiteCoreDisplayRuleItemDetails displayRule)
        {
            await SetOrUpdateCacheForOneRule(DisplayRuleCacheType.Brand, displayRule.Brand, displayRule);

            if (!displayRule.IsQuadUpdated)
            {
                await SetOrUpdateCacheForOneRule(DisplayRuleCacheType.ScreenInShop, displayRule.ScreenInShop?.ToString(), displayRule);
            }
            else
            {
                await SetOrUpdateCacheForOneRule(DisplayRuleCacheType.QuadOnScreenInShop,
                    $"{displayRule.ScreenInShop?.ToString()}_{ displayRule.DisplayOrder.ToString()}", displayRule);
            }

            await SetOrUpdateCacheForOneRule(DisplayRuleCacheType.Shop, displayRule.ShopId, displayRule);
            await SetOrUpdateCacheForOneRule(DisplayRuleCacheType.Location, displayRule.Location, displayRule);
            await SetOrUpdateAllCacheKeys(displayRule);
        }

        //Old Gantry no need in new Gantry
        public async Task SetOrUpdateAllCacheKeys(SiteCoreDisplayRuleItemDetails displayRule)
        {
            try
            {
                var currentScreenInShopCache = await GetCache<HashSet<string>>(ConstantsPropertyValues.AllCacheKeys);
                var key = displayRule.IsQuadUpdated ? $"{DisplayRuleCacheType.QuadOnScreenInShop}_{displayRule.ScreenInShop?.ToString()}_{ displayRule.DisplayOrder.ToString()}" : $"{DisplayRuleCacheType.ScreenInShop.ToString()}_{displayRule.ScreenInShop}";

                _cacheOptions = new DistributedCacheEntryOptions
                {
                    AbsoluteExpiration = DateTimeOffset.Now.AddHours(_gantryCache.AbsoluteExpiration),
                    SlidingExpiration = TimeSpan.FromHours(_gantryCache.SlidingExpiration)
                };

                if (currentScreenInShopCache != null)
                {
                    currentScreenInShopCache.Add(key);

                    await _labelIsolatedDistributedCache.SetAsync(ConstantsPropertyValues.AllCacheKeys, ConvertListToByteArray(currentScreenInShopCache), _cacheOptions, CancellationToken.None);
                }
                else
                {
                    await _labelIsolatedDistributedCache.SetAsync(ConstantsPropertyValues.AllCacheKeys, ConvertListToByteArray(new HashSet<string>() { key }), _cacheOptions, CancellationToken.None);
                }
            }
            catch (Exception e)
            {
                _log.LogError($"Error in Updating Cache ScreensInShopKeys, where display rule is: {displayRule}", e);
            }
        }
    }
}