using Frontend.Gantry.Shared.Core.Common.RegularExpressions;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using System.Linq;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.CreateUrl
{
    public interface IReplacePlaceHoldersInUrl
    {
        string ReplacePlaceHolders(SiteCoreDisplayRuleItemDetails? displayRule, string? result);
    }
    public class ReplacePlaceHoldersInUrl : IReplacePlaceHoldersInUrl
    {
        private readonly IRegexForGettingPlaceHolders _regexForGettingPlaceHolders;

        public ReplacePlaceHoldersInUrl(IRegexForGettingPlaceHolders regexForGettingPlaceHolders)
        {
            _regexForGettingPlaceHolders = regexForGettingPlaceHolders;
        }

        public string ReplacePlaceHolders(SiteCoreDisplayRuleItemDetails? displayRule,string? result)
        {
            var getPlaceHolders = _regexForGettingPlaceHolders.GetPlaceHolders(result);

            if (getPlaceHolders.Count > 0)
            {
                foreach (var placeHolder in getPlaceHolders)
                {
                    switch (placeHolder)
                    {
                        case "{eventid}":
                            result = result.Replace(placeHolder, displayRule?.EventId);
                            break;
                        case "{marketids}":
                            if (displayRule?.MarketIds?.Count > 0)
                            {
                                result = result.Replace(placeHolder, string.Join(",", displayRule.MarketIds.Select(x => x.id)));
                            }
                            break;
                        case "{eventId:marketid}":
                            result = result.Replace(placeHolder, displayRule?.EventId + ":" + displayRule?.MarketIds?.Select(x => x.id).FirstOrDefault());
                            break;
                        case "{typeId}":
                            result = result.Replace(placeHolder, displayRule?.TypeId);
                            break;
                        case "{itemidorpath}":
                            result = result.Replace(placeHolder, displayRule?.TargetItemId);
                            break;
                        case "{eventMarketPairs}":
                            result = result.Replace(placeHolder, displayRule?.EventMarketPairs);
                            break;
                        case "{typeIds}":
                            result = result.Replace(placeHolder, displayRule?.TypeIds);
                            break;
                        case "{contentItemId}":
                            result = result.Replace(placeHolder, displayRule?.contentItemId);
                            break;
                    }
                }
            }

            return result;
        }
    }
}