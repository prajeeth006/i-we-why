using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Bwin.Vanilla.Content;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.BusinessLogic.Cache;
using Frontend.Gantry.Shared.Core.BusinessLogic.Cache.Services;
using Frontend.Gantry.Shared.Core.BusinessLogic.JsonConverters;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore.Helpers;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Frontend.Gantry.Shared.Core.Services.SiteCore
{
    public interface ISiteCoreDisplayRuleService
    {
        Task<SiteCoreDisplayRuleItemDetails?> GetDisplayRuleItem(string itemId);
        Task<List<SiteCoreDisplayRuleItemDetails>> GetAllDisplayRuleItems();
        List<SiteCoreDisplayRuleItemDetails> PreparedRulesSpecificToGantryType(SiteCoreDisplayRuleItemDetails displayRule);
    }

    public class SiteCoreDisplayRuleService : ISiteCoreDisplayRuleService
    {
        private readonly IContentService _contentService;
        private readonly IDisplayManagerScreens _displayManagerScreens;
        private readonly ILogger<SiteCoreDisplayRuleService> _log;
        private readonly IDistributedCacheService _distributedCacheService;
        private readonly JsonSerializerSettings _settings = new JsonSerializerSettings { Converters = new[] { new SiteCoreDisplayRuleItemConverter() } };

        public SiteCoreDisplayRuleService(
            IContentService contentService,
            ILogger<SiteCoreDisplayRuleService> log, 
            IDistributedCacheService distributedCacheService, 
            IDisplayManagerScreens displayManagerScreens)
        {
            _contentService = contentService;
            _log = log;
            _displayManagerScreens = displayManagerScreens;
            _distributedCacheService = distributedCacheService;
        }
        public async Task<SiteCoreDisplayRuleItemDetails?> GetDisplayRuleItem(string itemId)
        {
            try
            {
                DocumentId documentId = SiteCoreHelper.GetDocumentIdBasedOnPathOrItemId(itemId);

                Content<IDocument> document = await _contentService.GetContentAsync<IDocument>(documentId, CancellationToken.None);

                if (!(document is SuccessContent<IDocument> { Document: IGantryConfigItem item }))
                {
                    _log.LogError($"Got invalid Content from sitecore {JsonConvert.SerializeObject(document)}", document);
                    return null;
                }

                if (string.IsNullOrEmpty(item.TargetingConfiguration))
                {
                    return null;
                }

                var siteCoreDisplayRuleItemDetails = JsonConvert.DeserializeObject<SiteCoreDisplayRuleItemDetails>(item.TargetingConfiguration, _settings);
                siteCoreDisplayRuleItemDetails.DisplayRuleItemId = itemId;

                using (_log.BeginScope(GetCustomLoggingProperties(siteCoreDisplayRuleItemDetails)))
                {
                    _log.LogInformation($"TargetConfiguration we got from sitecore: {item.TargetingConfiguration}");
                }

                return siteCoreDisplayRuleItemDetails;
            }
            catch (Exception e)
            {
                _log.LogError($"Not able to get Display rule for this Item id : {itemId}", e);
                return null;
            }
        }

        private Dictionary<string, object> GetCustomLoggingProperties(SiteCoreDisplayRuleItemDetails siteCoreDisplayRuleItemDetails)
        {
            var customProps = new Dictionary<string, object>();

            if (siteCoreDisplayRuleItemDetails != null)
            {
                if (siteCoreDisplayRuleItemDetails.DisplayRuleItemId != null)
                    customProps.Add("traceId", siteCoreDisplayRuleItemDetails.DisplayRuleItemId);

                if (siteCoreDisplayRuleItemDetails.TargetItemId != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.TargetItemId", siteCoreDisplayRuleItemDetails.TargetItemId);

                if (siteCoreDisplayRuleItemDetails.TargetItemPath != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.TargetItemPath", siteCoreDisplayRuleItemDetails.TargetItemPath);

                if (siteCoreDisplayRuleItemDetails.ShopId != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.ShopId", siteCoreDisplayRuleItemDetails.ShopId);

                if (siteCoreDisplayRuleItemDetails.ScreenInShop != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.ScreenInShop", siteCoreDisplayRuleItemDetails.ScreenInShop);

                if (siteCoreDisplayRuleItemDetails.Location != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.Location", siteCoreDisplayRuleItemDetails.Location);

                if (siteCoreDisplayRuleItemDetails.DeviceId != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.DeviceId", siteCoreDisplayRuleItemDetails.DeviceId);

                if (siteCoreDisplayRuleItemDetails.Brand != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.Brand", siteCoreDisplayRuleItemDetails.Brand);

                if (siteCoreDisplayRuleItemDetails.TemplateName != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.TemplateName", siteCoreDisplayRuleItemDetails.TemplateName);

                if (siteCoreDisplayRuleItemDetails.GroupsNames != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.GroupsNames", siteCoreDisplayRuleItemDetails.GroupsNames);

                if (siteCoreDisplayRuleItemDetails.Updated != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.Updated", siteCoreDisplayRuleItemDetails.Updated);

                if (siteCoreDisplayRuleItemDetails.TypeName != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.TypeName", siteCoreDisplayRuleItemDetails.TypeName);

                if (siteCoreDisplayRuleItemDetails.CategoryCode != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.CategoryCode", siteCoreDisplayRuleItemDetails.CategoryCode);

                if (siteCoreDisplayRuleItemDetails.ClassName != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.ClassName", siteCoreDisplayRuleItemDetails.ClassName);

                if (siteCoreDisplayRuleItemDetails.EventId != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.EventId", siteCoreDisplayRuleItemDetails.EventId);

                if (siteCoreDisplayRuleItemDetails.MarketIds != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.MarketIds", siteCoreDisplayRuleItemDetails.MarketIds);

                if (siteCoreDisplayRuleItemDetails.TypeId != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.TypeId", siteCoreDisplayRuleItemDetails.TypeId);

                if (siteCoreDisplayRuleItemDetails.DisplayOrder != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.DisplayOrder", siteCoreDisplayRuleItemDetails.DisplayOrder);

                if (siteCoreDisplayRuleItemDetails.CarouselDuration != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.CarouselDuration", siteCoreDisplayRuleItemDetails.CarouselDuration);

                if (siteCoreDisplayRuleItemDetails.DecoderID != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.DecoderID", siteCoreDisplayRuleItemDetails.DecoderID);

                if (siteCoreDisplayRuleItemDetails.EventMarketPairs != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.EventMarketPairs", siteCoreDisplayRuleItemDetails.EventMarketPairs);

                if (siteCoreDisplayRuleItemDetails.TypeIds != null)
                    customProps.Add("siteCoreDisplayRuleItemDetails.TypeIds", siteCoreDisplayRuleItemDetails.TypeIds);

                customProps.Add("siteCoreDisplayRuleItemDetails.IsStaticPromotion", siteCoreDisplayRuleItemDetails.IsStaticPromotion);
                customProps.Add("siteCoreDisplayRuleItemDetails.IsMultiView", siteCoreDisplayRuleItemDetails.IsMultiView);
                customProps.Add("siteCoreDisplayRuleItemDetails.IsSportsChannel", siteCoreDisplayRuleItemDetails.IsSportsChannel);
                customProps.Add("siteCoreDisplayRuleItemDetails.IsCarousel", siteCoreDisplayRuleItemDetails.IsCarousel);
            }
            return customProps;
        }

        public async Task<List<SiteCoreDisplayRuleItemDetails>> GetAllDisplayRuleItems()
        {
            var displayRules = new List<SiteCoreDisplayRuleItemDetails>();
            var paths = _displayManagerScreens.ScreensPath.Split(',');

            foreach (string path in paths)
            {
                DocumentId documentId = SiteCoreHelper.GetDocumentIdBasedOnPathOrItemId(path);
                await GetAllDisplayRulesRecursively(displayRules, documentId, 10);
            }

            return displayRules;
        }

        private async Task GetAllDisplayRulesRecursively(List<SiteCoreDisplayRuleItemDetails> documents, DocumentId location, int depth = 2)
        {
            if (_displayManagerScreens.IsMasterGantryEnabled)
            {
                await GetAllDisplayRulesRecursivelyNew(documents, location, depth);
            }
            else
            {
                await GetAllDisplayRulesRecursivelyOld(documents, location, depth);
            }
        }


        private async Task GetAllDisplayRulesRecursivelyOld(List<SiteCoreDisplayRuleItemDetails> documents,
            DocumentId location, int depth = 2)
        {
            if (depth > 0)
            {
                ContentLoadOptions contentLoadOptions = new ContentLoadOptions { PrefetchDepth = (uint)depth };
                var document = await _contentService.GetAsync<IDocument>(location, CancellationToken.None, contentLoadOptions);
                if (document != null)
                {

                    foreach (var childId in document.Data.Metadata.ChildIds)
                    {
                        var offerDocument = await _contentService.GetAsync<IDocument>(childId, CancellationToken.None, contentLoadOptions);

                        if (offerDocument != null && offerDocument is IGantryConfigItem t)
                        {
                            if (!string.IsNullOrEmpty(t.TargetingConfiguration))
                            {
                                try
                                {
                                    var siteCoreDisplayRuleItemDetails = JsonConvert.DeserializeObject<SiteCoreDisplayRuleItemDetails>(t.TargetingConfiguration, _settings);
                                    siteCoreDisplayRuleItemDetails.DisplayRuleItemId = (new Guid(t.Data.Metadata.Id.Id)).ToString("D").ToLower();
                                    documents.Add(siteCoreDisplayRuleItemDetails);
                                }
                                catch (Exception e)
                                {
                                    _log.LogError($"Deserialization Error: Target Configuration for this item {t.Metadata.Id} not able Deserialize. {e.StackTrace}", e.Message);
                                }
                            }
                        }
                        else
                            await GetAllDisplayRulesRecursivelyOld(documents, childId, depth - 1);
                    }
                }
            }
        }

        private async Task GetAllDisplayRulesRecursivelyNew(List<SiteCoreDisplayRuleItemDetails> documents,
            DocumentId location, int depth = 2)
        {
            if (depth > 0)
            {
                ContentLoadOptions contentLoadOptions = new ContentLoadOptions { PrefetchDepth = (uint)depth };
                var childDocuments = await _contentService.GetChildrenAsync<IDocument>(location, CancellationToken.None, contentLoadOptions);
                if (childDocuments != null)
                {
                    foreach (var offerDocument in childDocuments)
                    {
                        if (offerDocument != null && offerDocument is IScreensInDisplayManager s)
                        {
                            List<SiteCoreDisplayRuleItemDetails> tempDocuments = new List<SiteCoreDisplayRuleItemDetails>();
                            await GetAllDisplayRulesRecursivelyNew(tempDocuments, offerDocument.Metadata.Id, depth - 1);

                            var latestRule = tempDocuments?.OrderByDescending(x => x.Updated).FirstOrDefault();

                            if (latestRule != null)
                            {
                                var rulesSpecificToGantry = PreparedRulesSpecificToGantryType(latestRule);
                                documents.AddRange(rulesSpecificToGantry);
                                _ = _distributedCacheService.SetCacheWithRule(DisplayRuleCacheType.DisplayRuleItem, latestRule.DisplayRuleItemId, latestRule);
                            }

                        }
                        else if (offerDocument != null && offerDocument is IGantryConfigItem g)
                        {
                            if (!string.IsNullOrEmpty(g.TargetingConfiguration))
                            {
                                try
                                {
                                    var siteCoreDisplayRuleItemDetails = JsonConvert.DeserializeObject<SiteCoreDisplayRuleItemDetails>(g.TargetingConfiguration, _settings);
                                    siteCoreDisplayRuleItemDetails.DisplayRuleItemId = (new Guid(g.Data.Metadata.Id.Id)).ToString("D").ToLower();
                                    documents.Add(siteCoreDisplayRuleItemDetails);
                                }
                                catch (Exception e)
                                {
                                    _log.LogError($"Deserialization Error: Target Configuration for this item {g.Metadata.Id} not able Deserialize. {e.StackTrace}", e.Message);
                                }
                            }
                        }
                        else
                            await GetAllDisplayRulesRecursivelyNew(documents, offerDocument.Metadata.Id, depth - 1);
                    }
                }
            }
        }


        public List<SiteCoreDisplayRuleItemDetails> PreparedRulesSpecificToGantryType(SiteCoreDisplayRuleItemDetails displayRule)
        {
            List<SiteCoreDisplayRuleItemDetails> rules = new List<SiteCoreDisplayRuleItemDetails>();
            if (displayRule?.GantryScreens != null)
                foreach (var gantryScreen in displayRule.GantryScreens)
                {
                    if (gantryScreen != null)
                    {
                        var rule = (SiteCoreDisplayRuleItemDetails)displayRule.Clone();
                        rule.ScreenInShop = gantryScreen.screenId;
                        rule.GantryType = gantryScreen.screenTypeId;
                        rule.ViewId = gantryScreen.viewId;
                        rule.ViewGroup = gantryScreen.viewGroup;
                        rules.Add(rule);
                    }

                    
                }

            return rules;
        }

    }
}