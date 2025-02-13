using Frontend.Gantry.Shared.Core.BusinessLogic;
using Frontend.Gantry.Shared.Core.BusinessLogic.Cache.Services;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Frontend.Gantry.Controllers
{
    [AllowAnonymous]

    public class CacheController : Controller
    {
        private readonly IDistributedCacheService _distributedCacheService;
        private readonly ILogger<CacheController> _log;
        private readonly IInitializeDistributedCacheService _initializeDistributedCacheService;
        private readonly IDisplayRulesService _displayRulesService;

        public CacheController(IDistributedCacheService distributedCacheService, ILogger<CacheController> log, IInitializeDistributedCacheService initializeDistributedCacheService, IDisplayRulesService displayRulesService)
        {
            _distributedCacheService = distributedCacheService;
            _log = log;
            _initializeDistributedCacheService = initializeDistributedCacheService;
            _displayRulesService = displayRulesService;
        }
        [Route("{culture}/cache")]
        [Route("{culture}/cache/{controller}/GetDisplayRules")]
        public async Task<ActionResult> GetDisplayRules()
        {
            Dictionary<string, List<SiteCoreDisplayRuleItemDetails>> displayRules = new Dictionary<string, List<SiteCoreDisplayRuleItemDetails>>();
            try
            {
                var allKeys = await _distributedCacheService.GetCache<HashSet<string>>(ConstantsPropertyValues.AllCacheKeys);

                if (allKeys?.Count > 0)
                {
                    foreach (var key in allKeys)
                    {
                        var rules = await _distributedCacheService.GetCache<List<SiteCoreDisplayRuleItemDetails>>(key);
                        displayRules.Add(key, rules);
                    }
                }

                return View("DisplayRules", displayRules);
            }
            catch (Exception e)
            {
                _log.LogError($"Error in showing cache: {e.Message}", e);
                return View("DisplayRules", displayRules); ;
            }
        }

        public async Task<ActionResult> ReInitializeCache()
        {
            await _distributedCacheService.SetCache<string>(ConstantsPropertyValues.CacheInitialized, "False");
            await _initializeDistributedCacheService.Initialize();
            return await GetDisplayRules();
        }

        public async Task<ActionResult> GetCacheRuleItem(string ruleId)
        {
            Dictionary<string, List<SiteCoreDisplayRuleItemDetails>> displayRules = new Dictionary<string, List<SiteCoreDisplayRuleItemDetails>>();
            SiteCoreDisplayRuleItemDetails rule = await _displayRulesService.GetDisplayRuleByItemKey(ruleId);

            if (rule == null)
            {
                return View("DisplayRules", displayRules);
            }
            else
            {
                List<SiteCoreDisplayRuleItemDetails> rules = new List<SiteCoreDisplayRuleItemDetails>();
                rules.Add(rule);
                displayRules.Add(ruleId.ToString(), rules);
                return View("DisplayRules", displayRules);
            }

        }
    }
}