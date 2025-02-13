using GantryTradingConnector.Shared.Contracts.Responses.Fixture;
using GantryTradingConnector.Shared.GraphQL.Requests;

namespace GantryTradingConnector.Shared.GraphQL.Providers
{
    public interface IBetContentProvider
    {
        Task<FixtureInfoResponse> Search(SearchRequest model);

        Task<RegionInfoResponse> SearchRegions(RegionRequest model);

        Task<CompetitionInfoResponse> SearchCompetitions(CompetitionRequest model);

        Task<CompetitionInfoResponse> SearchCompetitionsWithoutRegions(CompetitionWithoutRegionRequest model);

        Task<FixtureInfoResponse> SearchFixtures(FixtureRequest model);

        Task<FixtureInfoWithoutRegionResponse> SearchFixturesWithoutRegions(FixtureWithoutRegionRequest model);
    }
}
