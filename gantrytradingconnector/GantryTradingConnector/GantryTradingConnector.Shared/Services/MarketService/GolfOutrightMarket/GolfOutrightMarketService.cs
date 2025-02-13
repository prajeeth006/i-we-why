using GantryTradingConnector.Shared.Models;
using GantryTradingConnector.Shared.Models.MarketModels;
using Microsoft.Extensions.Logging;

namespace GantryTradingConnector.Shared.Services.MarketService.GolfOutrightMarket
{
    public class GolfOutrightMarketService: IGolfOutrightMarketService
    {
        private readonly ILogger<MarketContentService> _logger;

        public GolfOutrightMarketService(ILogger<MarketContentService> logger)
        {
            _logger= logger;
        }

        public async Task<MarketResponse> GetGolfOutrightMarkets(
            Dictionary<string, FixtureParticipantOptions>? participantOptions,
            MarketResponse marketResponse)
        {
            if (participantOptions != null)
            {
                if (marketResponse is {TradingTemplates: not null})
                {
                    foreach (var tradingTemplate in marketResponse.TradingTemplates)
                    {
                        tradingTemplate.RacingMarkets = new List<RacingMarket>();
                        foreach (KeyValuePair<string, FixtureParticipantOptions> participantOption in
                                 participantOptions)
                        {
                            if (tradingTemplate.RacingMarkets.All(x =>
                                    x.id != Convert.ToInt32(participantOption.Value.MarketId)))
                            {
                                tradingTemplate.RacingMarkets.Add(new RacingMarket()
                                {
                                    id = Convert.ToInt32(participantOption.Value.MarketId)
                                });
                            }
                        }
                    }
                }
            }
            return marketResponse;
        }
    }
}
