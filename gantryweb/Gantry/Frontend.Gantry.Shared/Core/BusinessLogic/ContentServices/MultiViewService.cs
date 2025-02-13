using Bwin.Vanilla.Content;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore.Helpers;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.ContentServices
{

    public interface IMultiViewService
    {
        Task<IList<MultiViewUrl>> GetUrls(string itemId);
    }

    public class MultiViewService : IMultiViewService
    {
        private readonly IGantryUrlService _gantryUrlService;
        private readonly IContentService _contentService;
        private readonly IMultiViewRuleService _multiViewRuleService;
        private readonly ILogger<MultiViewService> _log;
        private readonly ICarouselService _carouselService;
        

        public MultiViewService(IGantryUrlService gantryUrlService, 
                                IContentService contentService,
                                IMultiViewRuleService multiViewRuleService, ILogger<MultiViewService> log,
                                ICarouselService carouselService)
        {
            _gantryUrlService = gantryUrlService;
            _contentService = contentService;
            _multiViewRuleService = multiViewRuleService;
            _log = log;
            _carouselService = carouselService;
        }

        public async Task<IList<MultiViewUrl>> GetUrls(string itemId)
        {
            IList<MultiViewUrl> multiViewUrls = new List<MultiViewUrl>();

            DocumentId documentId = SiteCoreHelper.GetDocumentIdBasedOnPathOrItemId(itemId);

            var multiViewRuleItemsParent = await _contentService.GetContentAsync<IDocument>(documentId, CancellationToken.None, new ContentLoadOptions
            {
                BypassCache = true
            });

            if (multiViewRuleItemsParent is SuccessContent<IDocument> && multiViewRuleItemsParent.Metadata?.ChildIds?.Count > 0)
            {
                _log.LogInformation($"Quad rules we got from Sitecore in case of multiview are: COUNT {multiViewRuleItemsParent.Metadata.ChildIds.Count}");
                foreach (DocumentId quadRuleItemId in multiViewRuleItemsParent.Metadata.ChildIds)
                {
                    SiteCoreDisplayRuleItemDetails? displayRule = await _multiViewRuleService.GetDisplayRuleMultiViewItem(quadRuleItemId.Id);

                    if (displayRule != null)
                    {
                        string url = await _gantryUrlService.PrepareUrl(displayRule);
                        _log.LogInformation($"Url we got from Sitecore: {url} for display Rule: {JsonConvert.SerializeObject(displayRule)}");
                        if (Uri.TryCreate(url, UriKind.Absolute, out Uri result))
                        {
                            multiViewUrls.Add(new MultiViewUrl()
                            {
                                DisplayOrder = displayRule.DisplayOrder.GetValueOrDefault(),
                                Url = result,
                                IsQuadUpdated = displayRule.IsQuadUpdated,
                                LastUpdated = displayRule.Updated
                            });
                        }
                        else
                        {
                            _log.LogInformation($"Multiview url cant be converted into Uri: {url} and display rule target is: {displayRule.TargetItemId} and display rule id is {quadRuleItemId.Id}");
                        }
                    }
                    else
                    {
                        _log.LogInformation($"Multiview display rule is null for this ID: {quadRuleItemId.Id} and this path: {quadRuleItemId.Path}");
                    }
                }
            }
            else
            {
                _log.LogError($"We didn't get success content from Sitecore for this itemId: {itemId} OR there are no childs for this multiview rule:  COUNT {multiViewRuleItemsParent?.Metadata?.ChildIds?.Count}");
            }

            //getting duplicate urls from sitecore.need to handle it in here.
            multiViewUrls = multiViewUrls.GroupBy(multiViewUrl => multiViewUrl.DisplayOrder)
                .Select(ruleGroups => ruleGroups.OrderBy(rule => rule.LastUpdated))
                .Select(ruleGroup => ruleGroup.Last()).ToList();

            _log.LogInformation($"Multiview URL's we got from Sitecore for itemId {itemId} is : {JsonConvert.SerializeObject(multiViewUrls)}");
            return multiViewUrls.OrderBy(multiViewUrl => multiViewUrl.DisplayOrder).ToList();
        }
    }
}