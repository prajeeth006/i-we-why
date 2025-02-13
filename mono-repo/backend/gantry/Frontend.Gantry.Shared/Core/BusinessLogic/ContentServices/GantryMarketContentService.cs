using Frontend.Gantry.Shared.Configuration;
using System.Collections.Generic;
using System.Linq;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.ContentServices
{
    public interface IGantryMarketContentService
    {
        IList<Markets> getGantryMarkets();
    }

    public class GantryMarketContentService : IGantryMarketContentService
    {

        private readonly IGantryMarkets _gantryMarkets;
        public GantryMarketContentService(IGantryMarkets gantryMarkets)
        {
            _gantryMarkets = gantryMarkets;
        }


        public IList<Markets> getGantryMarkets()
        {
            IList<Markets> markets = new List<Markets>();

            var dynaconMarkets = _gantryMarkets.MarketsNames;

            foreach (KeyValuePair<string, Dictionary<string, string>> dMarkets in dynaconMarkets)
            {
                IList<MarketName> marketnames = new List<MarketName>();
                foreach (KeyValuePair<string,string> dMarket in dMarkets.Value)
                {
                    marketnames.Add(new MarketName()
                    {
                        name = dMarket.Key,
                        matches = dMarket.Value?.Split(',').Select(m => m.Trim()).ToArray()
                    });
                }
                markets.Add(new Markets()
                {
                   sport = dMarkets.Key,
                   markets = marketnames
                });
            }

            return markets;
        }
    }

}