using GantryTradingConnector.Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Services
{
    public interface IBetContentDataService
    {
        Task<SportDetailResponse> GetSportsDetails(string? label);

        Task<FixtureV9Response> GetMarketDetailForVersionTwoFixture(string fixtureId, string? optionMarketIds = null, string? label = null, string? country = null, string? language = null, bool? skipMarketFilter = null, int? shopTier = null);

        Task<OptionMarketSlimsResponse> GetMarketDetailForVersionOneFixture(string fixtureId);

        Task<Event> GetMarketDetailForVersionOneFixtureNew(string fixtureId);
    }
}
