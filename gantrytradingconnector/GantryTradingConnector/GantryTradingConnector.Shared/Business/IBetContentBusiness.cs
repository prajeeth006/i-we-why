using GantryTradingConnector.Shared.Models;

namespace GantryTradingConnector.Shared.Business
{
    public interface IBetContentBusiness
    {
        Task<SportDetailResponse> GetSportsDetails(string? label);
        
        Task<FixtureV9Response> GetMarketDetailForVersionTwoFixture(string id, string? optionMarketIds = null, string? label = null, string? country = null, string? language = null, bool? skipMarketFilter = null, int? shopTier = null);

        Task<OptionMarketSlimsResponse> GetMarketDetailForVersionOneFixture(string fixtureid, string templateId = null);
        Task<Event> GetMarketDetailForVersionOneFixtureBCP(string fixtureid, string templateId = null);

    }
}
