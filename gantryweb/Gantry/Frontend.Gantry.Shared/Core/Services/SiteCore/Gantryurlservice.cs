using Frontend.Gantry.Shared.Core.BusinessLogic.CreateUrl;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using System;
using System.Threading.Tasks;
using Frontend.Gantry.Shared.Configuration;

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
                result = await _createUrlBasedOnRuleItem.CreateUrl(_gantryUrlsConfig.CarouselUrlItemPath);
            }
            else if (displayRule.IsStaticPromotion)
            {
                result = await _createUrlBasedOnRuleItem.CreateUrl(_gantryUrlsConfig.StaticPromotionsUrlItemPath);
            }
            else
            {
                result = await _createUrlBasedOnRuleItem.CreateUrl(displayRule);
            }

            string replacedPlaceHolderInUrl = _replacePlaceHoldersInUrl.ReplacePlaceHolders(displayRule, result?.ToString());

            return replacedPlaceHolderInUrl;
        }
    }
}