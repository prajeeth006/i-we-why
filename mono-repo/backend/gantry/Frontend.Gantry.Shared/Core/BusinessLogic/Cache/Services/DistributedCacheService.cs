using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Frontend.Vanilla.Core.Caching.Isolation;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.Cache.Services
{
    public interface IDistributedCacheService
    {
        Task SetCacheWithRule(DisplayRuleCacheType cacheType, string? propertyValue, SiteCoreDisplayRuleItemDetails displayRules);
        Task SetCacheForPresenceMessage(DisplayRuleCacheType cacheType, string? propertyValue, List<ScreenGroup> screenGroups);
        Task<T> GetCache<T>(string cacheKey) where T : class;
        Task<T> SetCache<T>(string cacheKey, string value) where T : class;
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
                        _ = SetCacheWithListOfRules(displayRuleCacheType, rules.Key, rules.ToList());
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
                _log.LogError(e,$"Error in Updating Cache for this display rules");
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
                _log.LogError(e,$"Error in Updating Cache for list of ScreenInShopKeys");
            }
        }

        private byte[] ConvertListToByteArray<T>(T cacheDisplayRules) where T : class 
        {
            MemoryStream ms = new MemoryStream();
            return System.Text.Json.JsonSerializer.SerializeToUtf8Bytes(cacheDisplayRules);
        }

        private T ConvertByteArrayToList<T>(byte[] arrBytes) where T : class
        {
            MemoryStream memStream = new MemoryStream();
            memStream.Write(arrBytes, 0, arrBytes.Length);
            memStream.Seek(0, SeekOrigin.Begin);
            T cache = (T)System.Text.Json.JsonSerializer.Deserialize(memStream,typeof(T));
            return cache;
        }
    }
}
