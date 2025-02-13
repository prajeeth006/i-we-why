using Bwin.Vanilla.Content;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore.Helpers;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.ContentServices
{

    public interface ICarouselService
    {
        Task<IList<CarouselUrl>> GetUrls(string itemId);
    }

    public class CarouselService : ICarouselService
    {
        private readonly IGantryUrlService _gantryUrlService;
        private readonly IContentService _contentService;
        private readonly IMultiViewRuleService _multiViewRuleService;
        private readonly ILogger<MultiViewService> _log;

        public CarouselService(IGantryUrlService gantryUrlService,
                                IContentService contentService,
                                IMultiViewRuleService multiViewRuleService, ILogger<MultiViewService> log)
        {
            _gantryUrlService = gantryUrlService;
            _contentService = contentService;
            _multiViewRuleService = multiViewRuleService;
            _log = log;
        }

        public async Task<IList<CarouselUrl>> GetUrls(string itemId)
        {
            IList<CarouselUrl> carouselUrls = new List<CarouselUrl>();

            DocumentId documentId = SiteCoreHelper.GetDocumentIdBasedOnPathOrItemId(itemId);

            var multiViewRuleItemsParent = await _contentService.GetContentAsync<IDocument>(documentId, CancellationToken.None, new ContentLoadOptions
            {
                BypassCache = true
            });

            if (multiViewRuleItemsParent is SuccessContent<IDocument> && multiViewRuleItemsParent.Metadata?.ChildIds?.Count > 0)
            {
                foreach (DocumentId childDocumentId in multiViewRuleItemsParent.Metadata.ChildIds)
                {
                    SiteCoreDisplayRuleItemDetails? displayRule = await _multiViewRuleService.GetDisplayRuleMultiViewItem(childDocumentId.Id);

                    if (displayRule != null)
                    {
                        string url = await _gantryUrlService.PrepareUrl(displayRule);
                        if ( Uri.TryCreate(url, UriKind.Absolute, out Uri result) && ValidateUrl(result))
                        {
                            carouselUrls.Add(new CarouselUrl()
                            {
                                DisplayOrder = displayRule.DisplayOrder.GetValueOrDefault(),
                                CarouselDuration = displayRule.CarouselDuration.GetValueOrDefault(),
                                Url = result
                            });
                        }
                        else
                        {
                            _log.LogInformation($"Carousel url cant be converted into Uri: {url} and display rule target is: {displayRule.TargetItemId} and display rule id is {childDocumentId.Id}");
                        }

                    }
                    else
                    {
                        _log.LogInformation($"Carousel display rule is null for this ID: {childDocumentId.Id} and this path: {childDocumentId.Path}");
                    }
                }
            }
            else
            {
                _log.LogError($"We didn't get success content from Sitecore for this itemId: {itemId} OR there are no Carousel urls:  COUNT {multiViewRuleItemsParent?.Metadata?.ChildIds?.Count}");
            }

            return carouselUrls.OrderBy(carouselUrl => carouselUrl.DisplayOrder).ToList();
        }

        /// <summary>
        ///  To check parameters are available or not in URI
        /// </summary>
        /// <param name="url">url</param>
        /// <returns>valid/invalid</returns>
        private bool ValidateUrl(Uri url)
        {
            var queryDictionary = System.Web.HttpUtility.ParseQueryString(url.Query);
            var allParams = queryDictionary.Cast<string>().Select(e => queryDictionary[e]);

            foreach ( var kvp in allParams) { 
                // to check null value
                if(string.IsNullOrEmpty(kvp))
                {
                    return false;
                }
            }
            return true;
        }
    }
}