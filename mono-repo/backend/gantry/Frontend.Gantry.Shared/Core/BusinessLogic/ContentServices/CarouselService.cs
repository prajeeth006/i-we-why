using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Services.SiteCore.Helpers;
using Microsoft.Extensions.Logging;
using Frontend.Vanilla.Content;
using Frontend.Gantry.Shared.Content.Implementation;
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Vanilla.Features.WebAbstractions;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.ContentServices
{

    public interface ICarouselService
    {
        Task<IList<CarouselUrl>> GetUrls(string itemId);
    }

    public class CarouselService : ICarouselService
    {
        private readonly IGantryUrlService _gantryUrlService;
        private readonly IGantryUrlsConfig _gantryUrlsConfig;
        private readonly IContentService _contentService;
        private readonly IMultiViewRuleService _multiViewRuleService;
        private readonly ILogger<MultiViewService> _log;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CarouselService(IGantryUrlService gantryUrlService, IGantryUrlsConfig gantryUrlsConfig,
                                IContentService contentService, IHttpContextAccessor httpContextAccessor,
                                IMultiViewRuleService multiViewRuleService, ILogger<MultiViewService> log)
        {
            _gantryUrlService = gantryUrlService;
            _contentService = contentService;
            _multiViewRuleService = multiViewRuleService;
            _log = log;
            _gantryUrlsConfig = gantryUrlsConfig;
            _httpContextAccessor = httpContextAccessor;
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
                        var carouselUrl = await GetCarouselUrl(childDocumentId.Id);
                        if (carouselUrl != null)
                        {
                            carouselUrls.Add(carouselUrl);
                        }
                        else
                        {
                            _log.LogInformation($"Carousel display rule is null or invalid for this ID: {childDocumentId.Id} and this path: {childDocumentId.Path}");
                        }
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

        private async Task<CarouselUrl?> GetCarouselUrl(string itemId)
        {
            DocumentId documentId = SiteCoreHelper.GetDocumentIdBasedOnPathOrItemId(itemId);

            Content<IDocument> document = await _contentService.GetContentAsync<IDocument>(documentId, CancellationToken.None, new ContentLoadOptions
            {
                BypassCache = true
            });

            CarouselUrl carouselUrl = null;
            if (!(document is SuccessContent<IDocument> { Document: ScreenJsonRuleDocument item }))
            {
                return null;
            }
            else
            {
                if (Uri.TryCreate(item.Url, UriKind.Absolute, out Uri result))
                {
                    if (result == null)
                    {
                        return null;
                    }

                    if (_gantryUrlsConfig.PreviewUrlEnabled)
                    {
                        result = ReplaceDomain(result) ?? result;
                    }

                    carouselUrl = new CarouselUrl()
                    {
                        Url = result,
                        CarouselDuration = item.Duration,
                        DisplayOrder = item.SortOrder
                    };
                }
                else
                {
                    _log.LogInformation($"Carousel url cant be converted into Uri: {item.Url} and display rule id is {itemId}");
                }
            }

            return carouselUrl;
        }

        private Uri? ReplaceDomain(Uri originalUri)
        {
            try
            {
                var hostUrl = _httpContextAccessor.HttpContext!.Request.GetAppBaseUrl();
                UriBuilder uriBuilder = new UriBuilder(originalUri)
                {
                    Host = hostUrl.Host,
                    Port = -1
                };

                return uriBuilder.Uri;
            }
            catch (Exception ex)
            {
                _log.LogError(ex, "Unable to replace domain url in carousel child url.");
                return null;
            }
        }
    }
}
