using GantryTradingConnector.Shared.Business;
using GantryTradingConnector.Shared.GraphQL.Requests;
using GantryTradingConnector.Shared.Contracts.Responses.Fixture;
using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture;
using GantryTradingConnector.Shared.GraphQL.Providers;
using GantryTradingConnector.Shared.Models;
using Microsoft.Extensions.Logging;
using System.Globalization;
using GantryTradingConnector.Shared.Models.MarketModels;

namespace GantryTradingConnector.Shared.Services
{
    public interface IMultiEventDataService
    {
        Task<List<OptionMarketSlimsResponse>> GetMultiEventsBasedOnVersion1_New(MultiEventRequest multiEventRequest);
        Task<List<FixtureV9Response>> GetMultiEventsBasedOnVersion2_New(MultiEventRequest multiEventRequest);
    }

    public class MultiEventDataService : IMultiEventDataService
    {
        private readonly ILogger<MultiEventDataService> _logger;

        private readonly IBetContentBusiness _betContentBusiness;

        private readonly IBetContentProvider _betContentProvider;

        public MultiEventDataService(ILogger<MultiEventDataService> logger, IBetContentBusiness betContentBusiness, IBetContentProvider betContentProvider)
        {
            _logger = logger;
            _betContentBusiness = betContentBusiness;
            _betContentProvider = betContentProvider;
        }

        private bool HasMatchedMarket(List<FixtureParameter> parameters, string marketNames)
        {
            bool foundMatchedParameters = true;
            var listOfMarkets = marketNames.Split(new string[] { "||" }, StringSplitOptions.None);
            foreach (var marketValues in listOfMarkets)
            {
                var marketParameters = marketValues.Split('|');

                Dictionary<string, string> dictionary =
                    marketParameters.ToDictionary(s => s.Split(':')[0], s => s.Split(':')[1]);

                dictionary.TryGetValue(TradingMarketDefaults.MatchExactProperties, out string matchExactProperties);
                int.TryParse(matchExactProperties, out int matchExactPropertiesCount);

                if (matchExactProperties == null || parameters.Count == matchExactPropertiesCount)
                {
                    foreach (KeyValuePair<string, string> keyValue in dictionary)
                    {
                        if (!(keyValue.Key?.ToLower() == (TradingMarketDefaults.MarketName).ToLower() ||
                              keyValue.Key?.ToLower() == (TradingMarketDefaults.MatchExactProperties).ToLower() ||
                              keyValue.Key?.ToLower() == (TradingMarketDefaults.MarketNameReg).ToLower()))
                        {
                            bool foundMatchedParameter = false;
                            foreach (var parameter in parameters)
                            {
                                if (keyValue.Key?.ToLower() == (TradingMarketDefaults.DecimalValue).ToLower())
                                {
                                    if (float.TryParse(parameter.Value, out float result))
                                    {
                                        parameter.Value = result.ToString(CultureInfo.InvariantCulture);
                                    }
                                }
                                if (parameter.Key?.ToLower() == keyValue.Key?.ToLower() && parameter.Value?.ToLower() == keyValue.Value?.ToLower())
                                {
                                    foundMatchedParameter = true;
                                    break;
                                }
                            }

                            if (!foundMatchedParameter)
                            {
                                foundMatchedParameters = false;
                                break;
                            }
                        }
                    }
                }
                else
                {
                    foundMatchedParameters = false;
                }


            }

            return foundMatchedParameters;
        }


        private CompetitionEventRequest PrepareDefaultCompetitionRequest(MultiEventRequest multiEventRequest)
        {
            CompetitionEventRequest competitionEventRequest = new CompetitionEventRequest();
            competitionEventRequest.Sort = new SortRequest { Field = "START_DATE", SortType = SortTypes.ASC };
            List<RangeRequest> ranges = new List<RangeRequest>();

            DateTime startDate = DateTime.Now;

            string startDateStr =
                Convert.ToString(new DateTime(startDate.Year, startDate.Month, startDate.Day, 0, 0, 0));

            int numberOfDays = multiEventRequest.End + 1;

            string endDateStr = Convert.ToString(startDate.AddDays(numberOfDays).Date.AddSeconds(-1));

            ranges.Add(new RangeRequest
            { Field = "START_DATE", Start = startDateStr, End = endDateStr, ConjunctionType = Conjunction.AND });
            competitionEventRequest.Ranges = ranges.ToArray();

            return competitionEventRequest;
        }

        private FixtureRequest PrepareDefaultCompetitionRequestNew(MultiEventRequest multiEventRequest)
        {
            FixtureRequest fixtureRequest = new FixtureRequest();
            fixtureRequest.SortField = "START_DATE";
            fixtureRequest.SortType = SortTypes.ASC;
            
            DateTime startDate = DateTime.Now;
            int numberOfDays = multiEventRequest.End + 1;
            fixtureRequest.StartDate = new DateTime(startDate.Year, startDate.Month, startDate.Day, 0, 0, 0);
            fixtureRequest.EndDate = startDate.AddDays(numberOfDays).Date.AddSeconds(-1);
            fixtureRequest.LabelId = multiEventRequest.LabelId;
            fixtureRequest.IsInPlay = multiEventRequest.IsInPlay;
            fixtureRequest.First = multiEventRequest.First;
            fixtureRequest.FixtureType = multiEventRequest.FixtureType;
            return fixtureRequest;
        }


        private CompetitionEventRequest PrepareCompetitionRequest(MultiEventRequest multiEventRequest, MultiEventParams multiEventParams, CompetitionEventRequest competitionEventRequest)
        {
            List<TermRequest> terms = new List<TermRequest>
            {
                new TermRequest
                {
                    Field = "Region_ID", Value = multiEventParams.RegionId.ToString(),
                    ConjunctionType = Conjunction.AND
                },
                new TermRequest
                {
                    Field = "SPORT_ID", Value = multiEventParams.SportId.ToString(),
                    ConjunctionType = Conjunction.AND
                },
                new TermRequest
                {
                    Field = "COMPETITION_ID", Value = multiEventParams.CompetitionId.ToString(),
                    ConjunctionType = Conjunction.AND
                }
            };
            competitionEventRequest.Terms = terms.ToArray();
            return competitionEventRequest;
        }

        private FixtureRequest PrepareCompetitionRequestNew(MultiEventRequest multiEventRequest, MultiEventParams multiEventParams, FixtureRequest fixtureRequest)
        {
            fixtureRequest.RegionId = multiEventParams.RegionId;
            fixtureRequest.SportId = multiEventParams.SportId;
            fixtureRequest.CompetitionId = multiEventParams.CompetitionId;
            return fixtureRequest;
        }

        private async Task<List<OptionMarketSlimsResponse>> GetEventDetailsFromVersion1(MultiEventRequest multiEventRequest, FixtureInfoResponse fixtures)
        {

            List<OptionMarketSlimsResponse> optionMarketSlimsResponses = new List<OptionMarketSlimsResponse>();
            await Parallel.ForEachAsync(fixtures.FixtureInfo.Fixtures, async (fixture, token2) =>
            {
                OptionMarketSlimsResponse optionMarketSlimsResponse =
                    await _betContentBusiness.GetMarketDetailForVersionOneFixture(RemoveVersionPrefix(fixture.Id),
                        multiEventRequest.TemplateIds);
                if (optionMarketSlimsResponse?.OptionMarketSlims != null &&
                    optionMarketSlimsResponse?.OptionMarketSlims.Count > 0)
                {
                    optionMarketSlimsResponse.Name = fixture.Name;
                    optionMarketSlimsResponse.StartDate = fixture.StartDate;
                    optionMarketSlimsResponses.Add(optionMarketSlimsResponse);
                }
            });

            return optionMarketSlimsResponses;
        }

        private async Task<List<FixtureV9Response>> GetEventDetailsFromVersion2(MultiEventRequest multiEventRequest, FixtureInfoResponse fixtures)
        {
            List<FixtureV9Response> fixtureV9Responses = new List<FixtureV9Response>();

            await Parallel.ForEachAsync(fixtures.FixtureInfo.Fixtures, async (fixture, token2) =>
            {
                FixtureV9Response fixtureV9Response =
                    await _betContentBusiness.GetMarketDetailForVersionTwoFixture(fixture.Id);
                if (fixtureV9Response != null && fixtureV9Response.FixtureV9Data != null)
                {
                    foreach (KeyValuePair<string, OptionMarkets> optionMarket in fixtureV9Response.FixtureV9Data
                                 .OptionMarkets)
                    {
                        if (optionMarket.Value?.Parameters != null)
                        {
                            if (optionMarket.Value?.Parameters != null &&
                                HasMatchedMarket(optionMarket.Value.Parameters, multiEventRequest.Markets))
                            {
                                var newOptionMarket = new Dictionary<string, OptionMarkets>();
                                newOptionMarket.Add(optionMarket.Key, optionMarket.Value);
                                fixtureV9Response.FixtureV9Data.OptionMarkets = newOptionMarket;
                                fixtureV9Response.FixtureV9Data.Options =
                                    new Dictionary<string, FixtureOptions>();
                                fixtureV9Response.FixtureV9Data.Participants =
                                    new Dictionary<string, FixtureParticipant>();
                                fixtureV9Response.FixtureV9Data.Tags = new List<FixtureTag>();
                                fixtureV9Response.FixtureV9Data.Name = new Dictionary<string, string>()
                                {
                                    { "Name", fixture.Name }
                                };
                                fixtureV9Responses.Add(fixtureV9Response);
                                break;
                            }
                        }
                    }
                }
            });

            return fixtureV9Responses;
        }

        private string RemoveVersionPrefix(string id)
        {
            var idArray = id.Split(':');
            if (idArray?.Length == 2)
            {
                return idArray[1];
            }

            return id;
        }

       

        public async Task<List<OptionMarketSlimsResponse>> GetMultiEventsBasedOnVersion1_New(MultiEventRequest multiEventRequest)
        {
            List<OptionMarketSlimsResponse> optionMarketSlimsResponses = new List<OptionMarketSlimsResponse>();

            try
            {
                FixtureRequest fixtureRequest = PrepareDefaultCompetitionRequestNew(multiEventRequest);
                foreach (var multiEventParams in multiEventRequest.MultiEventParams)
                {
                    fixtureRequest =
                        PrepareCompetitionRequestNew(multiEventRequest, multiEventParams, fixtureRequest);
                    FixtureInfoResponse fixtures =
                        await _betContentProvider.SearchFixtures(fixtureRequest);

                    optionMarketSlimsResponses.AddRange(await GetEventDetailsFromVersion1(multiEventRequest, fixtures));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception while getting multi events form version one");
            }

            return optionMarketSlimsResponses;
        }

        public async Task<List<FixtureV9Response>> GetMultiEventsBasedOnVersion2_New(MultiEventRequest multiEventRequest)
        {
            List<FixtureV9Response> fixtureV9Response = new List<FixtureV9Response>();

            try
            {
                FixtureRequest fixtureRequest= PrepareDefaultCompetitionRequestNew(multiEventRequest);
                foreach (var multiEventParams in multiEventRequest.MultiEventParams)
                {
                    fixtureRequest =
                        PrepareCompetitionRequestNew(multiEventRequest, multiEventParams, fixtureRequest);
                    FixtureInfoResponse fixtures =
                        await _betContentProvider.SearchFixtures(fixtureRequest);
                    fixtureV9Response.AddRange(await GetEventDetailsFromVersion2(multiEventRequest, fixtures));
                }
            }
            catch (Exception ex)
            {

                _logger.LogError(ex, "Exception while getting multi events form version two");
            }

            return fixtureV9Response;
        }
    }
}
