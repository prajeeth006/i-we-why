using GantryTradingConnector.Shared.Business;
using GantryTradingConnector.Shared.Contracts.Responses.Fixture;
using GantryTradingConnector.Shared.GraphQL.Providers;
using GantryTradingConnector.Shared.GraphQL.Requests;
using GantryTradingConnector.Shared.Models;
using GantryTradingConnector.Shared.Models.MarketModels;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Services.MarketService
{
    public class MarketMultiEventContentService : IMarketMultiEventContentService
    {
        private readonly ILogger<MarketMultiEventContentService> _logger;

        private readonly IBetContentProvider _betContentProvider;

        private readonly IBetContentBusiness _betContentBusiness;

        public MarketMultiEventContentService(ILogger<MarketMultiEventContentService> logger, IBetContentProvider betContentProvider, IBetContentBusiness betContentBusiness)
        {
            _logger = logger;
            _betContentProvider = betContentProvider;
            _betContentBusiness = betContentBusiness;
        }

        public Task<IList<RacingEvent>> GetMultiEventMarkets(MultiEventRequest multiEventRequest)
        {
            if (multiEventRequest.Version == 2)
                return GetMultiEventsForV2(multiEventRequest);
            return GetMultiEventsForV1(multiEventRequest);

        }

        public async Task<IList<RacingEvent>> GetMultiEventsForV1(MultiEventRequest multiEventRequest)
        {
            List<RacingEvent> racingEvents = new List<RacingEvent>();

            try
            {
                FixtureRequest fixtureRequest = PrepareDefaultCompetitionRequest(multiEventRequest);
                foreach (var multiEventParams in multiEventRequest.MultiEventParams)
                {
                    fixtureRequest =
                        PrepareCompetitionRequest(multiEventRequest, multiEventParams, fixtureRequest);
                    FixtureInfoResponse fixtures =
                        await _betContentProvider.SearchFixtures(fixtureRequest);

                    racingEvents.AddRange(await GetEventDetailsFromV1(multiEventRequest, fixtures));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception while getting multi events form version one");
            }

            return racingEvents;
        }

        public async Task<IList<RacingEvent>> GetMultiEventsForV2(MultiEventRequest multiEventRequest)
        {
            List<RacingEvent> racingEvents = new List<RacingEvent>();
            try
            {
                FixtureRequest fixtureRequest = PrepareDefaultCompetitionRequest(multiEventRequest);
                foreach (var multiEventParams in multiEventRequest.MultiEventParams)
                {
                    fixtureRequest =
                        PrepareCompetitionRequest(multiEventRequest, multiEventParams, fixtureRequest);
                    FixtureInfoResponse fixtures =
                        await _betContentProvider.SearchFixtures(fixtureRequest);
                    racingEvents.AddRange(await GetEventDetailsFromV2(multiEventRequest, fixtures));
                }
            }
            catch (Exception ex)
            {

                _logger.LogError(ex, "Exception while getting multi events form version two");
            }

            return racingEvents;
        }

        private FixtureRequest PrepareDefaultCompetitionRequest(MultiEventRequest multiEventRequest)
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

        private FixtureRequest PrepareCompetitionRequest(MultiEventRequest multiEventRequest, MultiEventParams multiEventParams, FixtureRequest fixtureRequest)
        {
            fixtureRequest.RegionId = multiEventParams.RegionId;
            fixtureRequest.SportId = multiEventParams.SportId;
            fixtureRequest.CompetitionId = multiEventParams.CompetitionId;
            return fixtureRequest;
        }

        private async Task<IList<RacingEvent>> GetEventDetailsFromV1(MultiEventRequest multiEventRequest, FixtureInfoResponse fixtures)
        {

            List<RacingEvent> racingEvent = new List<RacingEvent>();
            List<OptionMarketSlimsResponse> optionMarketSlimsResponses = new List<OptionMarketSlimsResponse>();
            await Parallel.ForEachAsync(fixtures.FixtureInfo.Fixtures, async (fixture, token2) =>
            {
                OptionMarketSlimsResponse optionMarketSlimsResponse =
                    await _betContentBusiness.GetMarketDetailForVersionOneFixture(RemoveVersionPrefix(fixture.Id),
                        multiEventRequest.TemplateIds);
                if (optionMarketSlimsResponse?.OptionMarketSlims != null &&
                    optionMarketSlimsResponse?.OptionMarketSlims.Count > 0)
                {
                    int.TryParse(RemoveVersionPrefix(fixture.Id), out int fixtureId);
                    IList<RacingMarket> racingmarkets = new List<RacingMarket>();
                    foreach (var optionMarketSlims in optionMarketSlimsResponse?.OptionMarketSlims){

                        int.TryParse(optionMarketSlims.Id, out int marketId);
                        racingmarkets.Add(new RacingMarket()
                        {
                            id = marketId
                        });
                    }

                    racingEvent.Add(new RacingEvent()
                    {
                        FixtureId = fixtureId,
                        Name = fixture.Name,
                        StartDate = fixture.StartDate.ToString(CultureInfo.InvariantCulture),
                        Markets = racingmarkets
                    });
                }
            });


            return racingEvent;
        }


        private async Task<List<RacingEvent>> GetEventDetailsFromV2(MultiEventRequest multiEventRequest, FixtureInfoResponse fixtures)
        {
            List<RacingEvent> racingEvent = new List<RacingEvent>();

            await Parallel.ForEachAsync(fixtures.FixtureInfo.Fixtures, async (fixture, token2) =>
            {
                FixtureV9Response fixtureV9Response =
                    await _betContentBusiness.GetMarketDetailForVersionTwoFixture(fixture.Id);
                if (fixtureV9Response != null && fixtureV9Response.FixtureV9Data != null)
                {

                    IList<RacingMarket> racingmarkets = new List<RacingMarket>();
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

                                int.TryParse(optionMarket.Value.Id, out int marketId);
                                racingmarkets.Add(new RacingMarket()
                                {
                                    id = marketId
                                });
                                break;
                            }
                        }
                    }

                    int.TryParse(RemoveVersionPrefix(fixtureV9Response.FixtureV9Data.Id), out int fixtureId);

                    racingEvent.Add(new RacingEvent()
                    {
                        FixtureId = fixtureId,
                        StartDate = fixtureV9Response.FixtureV9Data.StartDate,
                        Name = fixtureV9Response.FixtureV9Data.Name.GetValueOrDefault("Name") ?? "",
                        Markets = racingmarkets
                    });
                }
            });

            return racingEvent;
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
    }

}
