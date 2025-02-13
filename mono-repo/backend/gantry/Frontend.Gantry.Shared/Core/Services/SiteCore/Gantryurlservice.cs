    using Frontend.Gantry.Shared.Core.BusinessLogic.CreateUrl;
    using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
    using System;
    using System.Threading.Tasks;
    using Frontend.Gantry.Shared.Configuration;
    using System.Web;

    namespace Frontend.Gantry.Shared.Core.Services.SiteCore
    {
        public interface IGantryUrlService
        {
            Task<string> PrepareUrl(SiteCoreDisplayRuleItemDetails displayRule);
        }

        public class GantryUrlService : IGantryUrlService
        {
            private readonly ICreateUrlBasedOnRuleItem _createUrlBasedOnRuleItem;
            private readonly IGantryUrlsConfig _gantryUrlsConfig;
            private readonly IReplacePlaceHoldersInUrl _replacePlaceHoldersInUrl;

            public GantryUrlService(
                IGantryUrlsConfig gantryUrlsConfig,
                ICreateUrlBasedOnRuleItem createUrlBasedOnRuleItem,
                IReplacePlaceHoldersInUrl replacePlaceHoldersInUrl)
            {
                _gantryUrlsConfig = gantryUrlsConfig;
                _createUrlBasedOnRuleItem = createUrlBasedOnRuleItem;
                _replacePlaceHoldersInUrl = replacePlaceHoldersInUrl;
            }

            public async Task<string> PrepareUrl(SiteCoreDisplayRuleItemDetails displayRule)
            {
                Uri result = null;

                if (displayRule.IsMultiView)
                {
                    result = await _createUrlBasedOnRuleItem.CreateUrl(_gantryUrlsConfig.MultiviewUrlItemPath);
                }
                else if (displayRule.IsCarousel)
                {
                    //StoryID:DTP-16402 Remove "{}" from Carousel URLs
                    removeCurlybracketsFromTargetItemId(displayRule);
                    result = await _createUrlBasedOnRuleItem.CreateUrl(_gantryUrlsConfig.CarouselUrlItemPath);
                }
                else if (displayRule.IsStaticPromotion)
                {
                    //StoryID:DTP-16402 Remove "{}" from Static Promo
                    removeCurlybracketsFromTargetItemId(displayRule);
                    result = await _createUrlBasedOnRuleItem.CreateUrl(_gantryUrlsConfig.StaticPromotionsUrlItemPath);
                }
                else
                {
                    result = await _createUrlBasedOnRuleItem.CreateUrl(displayRule);
                }

                string replacedPlaceHolderInUrl = _replacePlaceHoldersInUrl.ReplacePlaceHolders(displayRule, result?.ToString());
           
                UriBuilder builder = new UriBuilder(replacedPlaceHolderInUrl);

                HandleRacingAssetType(builder);

                replacedPlaceHolderInUrl = builder.Uri?.ToString();

                return replacedPlaceHolderInUrl;
            }

            private void removeCurlybracketsFromTargetItemId(SiteCoreDisplayRuleItemDetails displayRule)
            {
                if (!string.IsNullOrEmpty(displayRule.TargetItemId))
                {
                    displayRule.TargetItemId = displayRule?.TargetItemId?.Replace("{", string.Empty)?.Replace("}", string.Empty);
                }
            }

            public void HandleRacingAssetType(UriBuilder builder)
            {
                var query = HttpUtility.ParseQueryString(builder.Query);

                // Create a dictionary to store non-empty parameters
                var parameters = new Dictionary<string, string>();
                foreach (string key in query)
                {
                    if (!string.IsNullOrEmpty(query[key]))
                    {
                        parameters[key] = query[key];
                    }
                }

                // Reconstruct the query string with non-empty parameters
                var filteredQuery = HttpUtility.ParseQueryString(string.Empty);
                foreach (var param in parameters)
                {
                    filteredQuery[param.Key] = param.Value;
                }

                builder.Query = filteredQuery.ToString();
            }
        }
    }
