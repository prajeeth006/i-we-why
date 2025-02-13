using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.BusinessLogic.CreateUrl;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Frontend.Gantry.Controllers
{
    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class GantryUrlApiController : BaseApiController
    {
        private readonly ISiteCoreDisplayRuleService _siteCoreDisplayRuleService;
        private readonly IMultiViewRuleService _multiViewRuleService;
        private readonly IMultiEventListRuleService _multiEventRuleService;
        private readonly IGantryUrlService _gantryUrlService;
        private readonly ILogger<GantryUrlApiController> _log;
        private readonly IScreenType _screenType;

        public GantryUrlApiController(ISiteCoreDisplayRuleService siteCoreDisplayRuleService, IGantryUrlService gantryUrlService, ILogger<GantryUrlApiController> log, IMultiViewRuleService multiViewRuleService, IMultiEventListRuleService multiEventRuleService, IScreenType screenType)
        {
            _siteCoreDisplayRuleService = siteCoreDisplayRuleService;
            _gantryUrlService = gantryUrlService;
            _multiViewRuleService = multiViewRuleService;
            _log = log;
            _multiEventRuleService = multiEventRuleService;
            _screenType = screenType;
        }

        [HttpGet, Route("getGantryUrlBasedOnDisplayRuleId")]
        public async Task<IActionResult> GetGantryUrlBasedOnDisplayRuleId(string displayRuleItemId)
        {
            try
            {
                string replacedPlaceHolderInUrl;
                SiteCoreDisplayRuleItemDetails? displayRule = await _siteCoreDisplayRuleService.GetDisplayRuleItem(displayRuleItemId);
                if (displayRule != null)
                {
                    replacedPlaceHolderInUrl = await GetReplacedPlaceHolderInUrl(displayRule);
                    return Content(string.Format(@"""{0}""", replacedPlaceHolderInUrl));
                }

                displayRule = await _multiViewRuleService.GetDisplayRuleMultiViewItem(displayRuleItemId);
                if (displayRule != null)
                {
                    replacedPlaceHolderInUrl = await GetReplacedPlaceHolderInUrl(displayRule);
                    return Content(string.Format(@"""{0}""", replacedPlaceHolderInUrl));
                }
            }
            catch (Exception e)
            {
                _log.LogError(e, $"GetGantryUrlBasedOnDisplayRuleId Failed for ID {displayRuleItemId}: {e.Message}");
            }

            return Content(string.Empty);
        }

        [HttpGet, Route("getGantryUrlBasedOnTargetId")]
        public async Task<string> GetGantryUrlBasedOnTargetId(string displayRuleItemId)
        {
            string typeIds = string.Empty;
            string eventMarketPairs = string.Empty;
            try
            {
                PreviewAssetDetails? previewAssetDetails =
                    JsonConvert.DeserializeObject<PreviewAssetDetails>(displayRuleItemId);

                SiteCoreDisplayRuleItemDetails displayRule = new SiteCoreDisplayRuleItemDetails();
                if (previewAssetDetails?.isMultiEventTreeNode ?? false)
                {
                    MultiEventPreviewDetails? multiEventRules = await _multiEventRuleService.GetDisplayRuleMultiEventItem(previewAssetDetails?.id);
                    if (multiEventRules != null && multiEventRules?.racingEvents?.Count() > 0)
                    {
                        typeIds = GetMultiEventTypeIds(multiEventRules.racingEvents);
                        var getMarkets = multiEventRules.racingEvents = multiEventRules.racingEvents.Where(x => x.markets != null).ToList();
                        if (getMarkets?.Count() > 0)
                        {
                            eventMarketPairs = GetMultiEventMarketPairs(multiEventRules.racingEvents);
                        }
                    }

                    displayRule.TargetItemId = multiEventRules?.target;
                    displayRule.EventMarketPairs = eventMarketPairs;
                    displayRule.TypeIds = typeIds;
                    displayRule.IsCarousel = previewAssetDetails?.isCarousleNode ?? false;
                    displayRule.IsStaticPromotion = previewAssetDetails?.isPromotionTreeNode ?? false;
                    displayRule.IsMultiEvent = previewAssetDetails?.isMultiEventTreeNode ?? false;
                    displayRule.isMisc = previewAssetDetails?.isMisc ?? false;

                }
                else
                {
                    if (!string.IsNullOrEmpty((previewAssetDetails?.targetLink)))
                    {
                        displayRule.TargetItemId = previewAssetDetails?.targetLink != null
                            ? previewAssetDetails.targetLink
                            : previewAssetDetails?.id;
                    }
                    else
                    {
                        displayRule.TargetItemId = previewAssetDetails?.racingEvent != null
                            ? previewAssetDetails.racingEvent.targetLink : (previewAssetDetails?.targetId != null && previewAssetDetails.isManualTreeNode) ? previewAssetDetails.targetId
                                : previewAssetDetails?.id;
                    }


                    displayRule.EventId = previewAssetDetails?.id;
                    displayRule.MarketIds = previewAssetDetails?.racingEvent?.markets;
                    displayRule.TypeId = previewAssetDetails?.racingEvent?.typeId.ToString();
                    displayRule.IsCarousel = previewAssetDetails?.isCarousleNode ?? false;
                    displayRule.IsStaticPromotion = previewAssetDetails?.isPromotionTreeNode ?? false;
                    displayRule.IsMultiEvent = previewAssetDetails?.isMultiEventTreeNode ?? false;
                    displayRule.contentItemId = previewAssetDetails?.contentItemId ?? previewAssetDetails?.id;
                    displayRule.isMisc = previewAssetDetails?.isMisc ?? false;

                }

                string replacedPlaceHolderUrl = await _gantryUrlService.PrepareUrl(displayRule);
                replacedPlaceHolderUrl = _screenType.SetScreenType(null, replacedPlaceHolderUrl);
                return string.Format(@"""{0}""", replacedPlaceHolderUrl);
            }
            catch (Exception e)
            {
                _log.LogError(e, $"GetGantryUrlBasedOnDisplayRuleId Failed for ID {displayRuleItemId}: {e.Message}");
                throw;
            }
        }

        public string GetMultiEventTypeIds(List<RacingEvent> racingEvents)
        {
            string typeIds = string.Join(",", racingEvents.Select(x => x.id));
            return typeIds;
        }

        public string GetMultiEventMarketPairs(List<RacingEvent> racingEvents)
        {
            string eventMarketPairs = string.Empty;
            foreach (var typeIdsAndMarkets in racingEvents)
            {
                if (typeIdsAndMarkets != null && typeIdsAndMarkets?.markets?.Count() > 0)
                {
                    var getMarkets = typeIdsAndMarkets.markets.FirstOrDefault();
                    if (getMarkets != null)
                    {
                        eventMarketPairs = eventMarketPairs + typeIdsAndMarkets.id + ":" + getMarkets?.id + ",";
                    }
                }
            }
            eventMarketPairs = (eventMarketPairs.Length > 0) ? eventMarketPairs.Remove(eventMarketPairs.Length - 1, 1) : eventMarketPairs;
            return eventMarketPairs;
        }

        [HttpPost("getGantryUrlBasedOnID")]
        public async Task<string> getGantryUrlBasedOnID([FromBody] PrepareGantryUrl prepareGantryUrl)
        {
            string typeIds = string.Empty;
            string eventMarketPairs = string.Empty;
            try
            {
                PreviewAssetDetails? previewAssetDetails =
                    JsonConvert.DeserializeObject<PreviewAssetDetails>(prepareGantryUrl.targetItemID);

                SiteCoreDisplayRuleItemDetails displayRule = new SiteCoreDisplayRuleItemDetails();
                if (previewAssetDetails?.isMultiEventTreeNode ?? false)
                {
                    MultiEventPreviewDetails? multiEventRules = await _multiEventRuleService.GetDisplayRuleMultiEventItem(previewAssetDetails?.id);
                    if (multiEventRules != null && multiEventRules?.racingEvents?.Count() > 0)
                    {
                        typeIds = GetMultiEventTypeIds(multiEventRules.racingEvents);
                        var getMarkets = multiEventRules.racingEvents = multiEventRules.racingEvents.Where(x => x.markets != null).ToList();
                        if (getMarkets?.Count() > 0)
                        {
                            eventMarketPairs = GetMultiEventMarketPairs(multiEventRules.racingEvents);
                        }
                    }

                    displayRule.TargetItemId = multiEventRules?.target;
                    displayRule.EventMarketPairs = eventMarketPairs;
                    displayRule.TypeIds = typeIds;
                    displayRule.IsCarousel = previewAssetDetails?.isCarousleNode ?? false;
                    displayRule.IsStaticPromotion = previewAssetDetails?.isPromotionTreeNode ?? false;
                    displayRule.IsMultiEvent = previewAssetDetails?.isMultiEventTreeNode ?? false;
                    displayRule.isMisc = previewAssetDetails?.isMisc ?? false;
                    displayRule.TradingPartitionId = previewAssetDetails?.racingEvent?.TradingPartitionId;
                    displayRule.RacingAssetType = previewAssetDetails?.racingEvent?.assetType;
                    displayRule.SplitScreen = previewAssetDetails?.racingEvent?.splitScreen;

                }
                else
                {
                    if (!string.IsNullOrEmpty((previewAssetDetails?.targetLink)))
                    {
                        displayRule.TargetItemId = previewAssetDetails?.targetLink != null
                            ? previewAssetDetails.targetLink
                            : previewAssetDetails?.id;
                    }
                    else
                    {
                        displayRule.TargetItemId = previewAssetDetails?.racingEvent != null
                            ? previewAssetDetails.racingEvent.targetLink : (previewAssetDetails?.targetId != null && previewAssetDetails.isManualTreeNode) ? previewAssetDetails.targetId
                                : previewAssetDetails?.id;
                    }


                    displayRule.EventId = previewAssetDetails?.id;
                    displayRule.MarketIds = previewAssetDetails?.racingEvent?.markets;
                    displayRule.TypeId = previewAssetDetails?.racingEvent?.typeId.ToString();
                    displayRule.IsCarousel = previewAssetDetails?.isCarousleNode ?? false;
                    displayRule.IsStaticPromotion = previewAssetDetails?.isPromotionTreeNode ?? false;
                    displayRule.IsMultiEvent = previewAssetDetails?.isMultiEventTreeNode ?? false;
                    displayRule.contentItemId = previewAssetDetails?.contentItemId ?? previewAssetDetails?.id;
                    displayRule.isMisc = previewAssetDetails?.isMisc ?? false;
                    displayRule.TradingPartitionId = previewAssetDetails?.racingEvent?.TradingPartitionId;
                    displayRule.RacingAssetType = previewAssetDetails?.racingEvent?.assetType;
                    displayRule.SplitScreen = previewAssetDetails?.racingEvent?.splitScreen;
                }

                string replacedPlaceHolderUrl = await _gantryUrlService.PrepareUrl(displayRule);
                replacedPlaceHolderUrl = _screenType.SetScreenType(null, replacedPlaceHolderUrl);
                return string.Format(@"""{0}""", replacedPlaceHolderUrl);
            }
            catch (Exception e)
            {
                _log.LogError(e, $"GetGantryUrlBasedOnID Failed for ID {prepareGantryUrl.targetItemID}: {e.Message}");
                throw;
            }
        }

        [HttpPost("getGantryUrlBasedOnIDNew")]
        public async Task<string> getGantryUrlBasedOnID([FromBody] PrepareGantryPreviewAssetNewUrl prepareGantryUrl)
        {
            string typeIds = string.Empty;
            string eventMarketPairs = string.Empty;
            try
            {
                PreviewAssetMainTreeNode? previewAssetDetails =
                    JsonConvert.DeserializeObject<PreviewAssetMainTreeNode>(prepareGantryUrl.TargetItemId);

                SiteCoreDisplayRuleItemDetails displayRule = new SiteCoreDisplayRuleItemDetails();
                if (previewAssetDetails?.nodeProperties?.isMultiEventTreeNode ?? false)
                {
                    if (previewAssetDetails?.nodeProperties?.id != null)
                    {
                        MultiEventPreviewDetails? multiEventRules = await _multiEventRuleService.GetDisplayRuleMultiEventItem(previewAssetDetails.nodeProperties.id);
                        if (multiEventRules != null && multiEventRules?.racingEvents?.Count() > 0)
                        {
                            typeIds = GetMultiEventTypeIds(multiEventRules.racingEvents);
                            var getMarkets = multiEventRules.racingEvents = multiEventRules.racingEvents.Where(x => x.markets != null).ToList();
                            if (getMarkets?.Count() > 0)
                            {
                                eventMarketPairs = GetMultiEventMarketPairs(multiEventRules.racingEvents);
                            }
                        }

                        displayRule.TargetItemId = multiEventRules?.target;
                    }

                    displayRule.EventMarketPairs = eventMarketPairs;
                    displayRule.TypeIds = typeIds;
                    displayRule.IsCarousel = previewAssetDetails?.nodeProperties?.isCarousleNode ?? false;
                    displayRule.IsStaticPromotion = previewAssetDetails?.nodeProperties?.isPromotionTreeNode ?? false;
                    displayRule.IsMultiEvent = previewAssetDetails?.nodeProperties?.isMultiEventTreeNode ?? false;
                    displayRule.isMisc = previewAssetDetails?.nodeProperties?.isMisc ?? false;
                    displayRule.TradingPartitionId = previewAssetDetails?.racingEvent?.TradingPartitionId;
                }
                else
                {
                    if (!string.IsNullOrEmpty((previewAssetDetails?.nodeProperties?.targetLink)))
                    {
                        displayRule.TargetItemId = previewAssetDetails?.nodeProperties?.targetLink != null
                            ? previewAssetDetails?.nodeProperties?.targetLink
                            : previewAssetDetails?.nodeProperties?.id;
                    }
                    else
                    {
                        displayRule.TargetItemId = previewAssetDetails?.racingEvent != null
                            ? previewAssetDetails.racingEvent.targetLink : (previewAssetDetails?.nodeProperties?.targetId != null && previewAssetDetails.nodeProperties.isManualTreeNode) ? previewAssetDetails?.nodeProperties?.targetId
                                : previewAssetDetails?.nodeProperties?.id;
                    }


                    displayRule.EventId = previewAssetDetails?.nodeProperties?.id;
                    displayRule.MarketIds = previewAssetDetails?.racingEvent?.markets;
                    displayRule.TypeId = previewAssetDetails?.racingEvent?.typeId.ToString();
                    displayRule.IsCarousel = previewAssetDetails?.nodeProperties?.isCarousleNode ?? false;
                    displayRule.IsStaticPromotion = previewAssetDetails?.nodeProperties?.isPromotionTreeNode ?? false;
                    displayRule.IsMultiEvent = previewAssetDetails?.nodeProperties?.isMultiEventTreeNode ?? false;
                    displayRule.contentItemId = previewAssetDetails?.nodeProperties?.contentItemId ?? previewAssetDetails?.nodeProperties?.id;
                    displayRule.isMisc = previewAssetDetails?.nodeProperties?.isMisc ?? false;
                    displayRule.TradingPartitionId = previewAssetDetails?.racingEvent?.TradingPartitionId;

                }

                string replacedPlaceHolderUrl = await _gantryUrlService.PrepareUrl(displayRule);
                replacedPlaceHolderUrl = _screenType.SetScreenType(null, replacedPlaceHolderUrl);
                return string.Format(@"""{0}""", replacedPlaceHolderUrl);
            }
            catch (Exception e)
            {
                _log.LogError(e, $"GetGantryUrlBasedOnID Failed for ID {prepareGantryUrl.TargetItemId}: {e.Message}");
                throw;
            }
        }

        public async Task<string> GetReplacedPlaceHolderInUrl(SiteCoreDisplayRuleItemDetails displayRule)
        {
            string replacedPlaceHolderUrl = await _gantryUrlService.PrepareUrl(displayRule);
            replacedPlaceHolderUrl = _screenType.SetScreenType(null, replacedPlaceHolderUrl);
            return replacedPlaceHolderUrl;
        }

    }
}
