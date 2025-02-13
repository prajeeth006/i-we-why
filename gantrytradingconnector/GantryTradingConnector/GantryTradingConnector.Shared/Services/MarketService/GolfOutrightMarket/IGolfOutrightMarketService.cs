using GantryTradingConnector.Shared.Models;
using GantryTradingConnector.Shared.Models.MarketModels;

namespace GantryTradingConnector.Shared.Services.MarketService.GolfOutrightMarket
{
    public interface IGolfOutrightMarketService
    {
        Task<MarketResponse> GetGolfOutrightMarkets(Dictionary<string, FixtureParticipantOptions>? participantOptions, MarketResponse marketResponse);
    }
}
