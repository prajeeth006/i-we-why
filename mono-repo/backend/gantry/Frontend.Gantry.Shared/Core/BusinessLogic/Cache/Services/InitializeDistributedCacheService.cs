using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using Microsoft.Extensions.Logging;

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
    }
}
