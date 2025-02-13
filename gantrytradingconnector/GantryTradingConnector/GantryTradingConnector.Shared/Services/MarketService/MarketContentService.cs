using GantryTradingConnector.Shared.Business;
using GantryTradingConnector.Shared.Models;
using GantryTradingConnector.Shared.Models.MarketModels;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Globalization;
using GantryTradingConnector.Shared.Services.MarketService.GolfOutrightMarket;

namespace GantryTradingConnector.Shared.Services.MarketService
{
    public class MarketContentService : IMarketContentService
    {
        private readonly IBetContentDataService _betContentDataService;
        private readonly IBetContentBusiness _betContentBusiness;
        private readonly ILogger<MarketContentService> _logger;
        private readonly IGolfOutrightMarketService _golfOutrightMarketService;

        public MarketContentService(
            IBetContentDataService betContentDataService,
            IBetContentBusiness betContentBusiness,
            ILogger<MarketContentService> logger, IGolfOutrightMarketService golfOutrightMarketService)
        {
            _betContentDataService = betContentDataService;
            _betContentBusiness = betContentBusiness;
            _logger = logger;
            _golfOutrightMarketService = golfOutrightMarketService;
        }

        public async Task<MarketResponse> GetMarkets(MarketRequest marketRequest)
        {
            MarketResponse markets = new MarketResponse();
            try
            {
                if (string.Equals(marketRequest.Version.ToLower(), TradingVersions.Version1))
                {

                    if (marketRequest.IsBCPApiEnabled == true)
                    {
                        markets = await GetMarketsFromBcp(marketRequest);
                    }
                    else
                    {
                        markets = await GetMarketsFromTv1(marketRequest);

                    }
                }
                else if (string.Equals(marketRequest.Version.ToLower(), TradingVersions.Version2))
                {

                    markets = await GetMarketsFromTv2(marketRequest);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception while getting markets");
            }

            return markets;
        }

        private async Task<MarketResponse> GetMarketsFromBcp(MarketRequest marketRequest)
        {
            Stopwatch gtcTimer = new Stopwatch();
            Stopwatch tcaTimer = new Stopwatch();

            gtcTimer.Start();
            tcaTimer.Start();

            MarketResponse marketResponse = new MarketResponse();
            Event bcpResponse = await _betContentDataService.GetMarketDetailForVersionOneFixtureNew(GetIdWithoutColon(marketRequest.FixtureId));
            _logger.LogInformation(JsonConvert.SerializeObject(bcpResponse));
            tcaTimer.Stop();
            var tcaElapsedTime = tcaTimer.ElapsedMilliseconds;
            marketResponse.TradingTemplates = marketRequest.TradingTemplates.Select(x => new TradingTemplateMarkets(x)).ToList();


            if (bcpResponse?.Markets?.Market != null && bcpResponse.Markets.Market.Any())
            {
                foreach (var tradingTemplate in marketResponse.TradingTemplates)
                {
                    if (string.IsNullOrEmpty(tradingTemplate.TemplateIds))
                    {
                        ConvertBcpFixtureTemplateToRacingMarket(bcpResponse.Markets.Market.OrderBy(x => x.Name).ToList(), tradingTemplate);
                    }
                    else
                    {
                        string[] templateIdData = tradingTemplate.TemplateIds.Split("|");
                        ConvertBcpFixtureTemplateToRacingMarket(bcpResponse.Markets.Market.Where(x => templateIdData.Contains(x.TemplateId.ToString()) == true).OrderBy(x => x.TemplateId).ToList(), tradingTemplate);
                    }
                    tradingTemplate.UrlTradingResponse = bcpResponse.UrlTradingResponse;
                    tradingTemplate.TCALatency = tcaElapsedTime;

                }
                
            }

            gtcTimer.Stop();
            marketResponse.GTCLatency = gtcTimer.ElapsedMilliseconds;

            return marketResponse;

        }

        private async Task<MarketResponse> GetMarketsFromTv1(MarketRequest marketRequest)
        {
            Stopwatch gtcTimer = new Stopwatch();
            Stopwatch tcaTimer = new Stopwatch();

            gtcTimer.Start();
            tcaTimer.Start();

            MarketResponse marketResponse = new MarketResponse();
            marketResponse.TradingTemplates = marketRequest.TradingTemplates.Select(x => new TradingTemplateMarkets(x)).ToList();
            OptionMarketSlimsResponse optionMarketSlimsResponse = await _betContentDataService.GetMarketDetailForVersionOneFixture(GetIdWithoutColon(marketRequest.FixtureId));
            tcaTimer.Stop();

            foreach (var tradingTemplate in marketResponse.TradingTemplates)
            {
                List<OptionMarketSlims> optionMarketSlims = new List<OptionMarketSlims>();
                if (optionMarketSlimsResponse.OptionMarketSlims.Any())
                {
                    if (string.IsNullOrEmpty(tradingTemplate.TemplateIds))
                    {
                        optionMarketSlims = optionMarketSlimsResponse.OptionMarketSlims = optionMarketSlimsResponse.OptionMarketSlims.OrderBy(x => x.NameId).ToList();
                    }
                    else
                    {
                        string[] templateIdData = tradingTemplate.TemplateIds.Split("|");
                        optionMarketSlims = optionMarketSlimsResponse.OptionMarketSlims.Where(x => templateIdData.Contains(x.TemplateId)).OrderBy(x => x.TemplateId).ToList();
                    }
                }

                ConvertTv1FixtureTemplateToRacingMarket(optionMarketSlims, tradingTemplate);
                tradingTemplate.UrlTradingResponse = optionMarketSlimsResponse.UrlTradingResponse;
                tradingTemplate.TCALatency = tcaTimer.ElapsedMilliseconds;
            }

            gtcTimer.Stop();
            marketResponse.GTCLatency = gtcTimer.ElapsedMilliseconds;

            return marketResponse;
        }

        private async Task<MarketResponse> GetMarketsFromTv2(MarketRequest marketRequest)
        {
            Stopwatch gtcTimer = new Stopwatch();
            Stopwatch tcaTimer = new Stopwatch();

            gtcTimer.Start();
            tcaTimer.Start();

            MarketResponse marketResponse = new MarketResponse
            {
                TradingTemplates = marketRequest.TradingTemplates.Select(x => new TradingTemplateMarkets(x)).ToList()
            };
            FixtureV9Response betContentResponse = await _betContentBusiness.GetMarketDetailForVersionTwoFixture("2:" + GetIdWithoutColon(marketRequest.FixtureId),null,null,null,marketRequest.language,marketRequest.skipMarketFilter);

            tcaTimer.Stop();

            if (marketRequest.isGolfOutrightMarket)
            {
                await _golfOutrightMarketService.GetGolfOutrightMarkets(betContentResponse?.FixtureV9Data?.ParticipantOptions, marketResponse);
            }
            else
            {
                foreach (var tradingTemplate in marketResponse.TradingTemplates)
                {
                    ConvertTv2FixtureTemplateToRacingMarket(betContentResponse.FixtureV9Data?.OptionMarkets,
                        tradingTemplate);

                    tradingTemplate.UrlTradingResponse = betContentResponse.UrlTradingResponse;
                    tradingTemplate.TCALatency = tcaTimer.ElapsedMilliseconds;
                }
            }

            gtcTimer.Stop();
            marketResponse.GTCLatency = gtcTimer.ElapsedMilliseconds;

            return marketResponse;

        }


        private void ConvertBcpFixtureTemplateToRacingMarket(List<Market> markets, TradingTemplateMarkets tradingTemplateData)
        {
            tradingTemplateData.RacingMarkets = new List<RacingMarket>();

            var templateIdsList = tradingTemplateData.TemplateIds?.Split('|');
            var templateMarketsList = tradingTemplateData.MarketNames.Split(new string[] { "||" }, StringSplitOptions.None);


            if (templateIdsList != null)
            {
                int i = 0;
                foreach (var templateId in templateIdsList)
                {
                    var marketName = templateMarketsList[i];
                    var marketParameters = marketName.Split('|');

                    Dictionary<string, string> marketParamDictionary =
                        marketParameters.ToDictionary(s => s.Split(':')[0], s => s.Split(':')[1]);

                    var marketsWithMatchedTemplateIds = markets.Where(x => x.TemplateId?.ToString() == templateId).ToList();


                    foreach (var market in marketsWithMatchedTemplateIds)
                    {
                        string? eventName = market.TemplateId?.ToString();
                        if (marketParamDictionary.TryGetValue(TradingMarketDefaults.MarketGroup, out string? marketNameExpression))
                        {
                            eventName = marketNameExpression?.Trim();
                        }

                        string? preparedMarketName = PrepareMarketNameForVersionOneBcp(market, tradingTemplateData);
                        if (preparedMarketName != null)
                        {
                            RacingMarket racingMarket = new RacingMarket
                            {
                                id = Convert.ToInt32(market.Id),
                                name = preparedMarketName,
                                startTime = DateTime.Now.ToString(CultureInfo.InvariantCulture),
                                eventName = eventName
                            };
                            tradingTemplateData.RacingMarkets.Add(racingMarket);
                        }
                    }

                    i++;
                }
            }
        }

        private void ConvertTv1FixtureTemplateToRacingMarket(List<OptionMarketSlims> fixturesResponse, TradingTemplateMarkets tradingTemplateData)
        {
            tradingTemplateData.RacingMarkets = new List<RacingMarket>();

            foreach (var fixture in fixturesResponse)
            {
                RacingMarket racingMarket = new RacingMarket
                {
                    id = Convert.ToInt32(fixture.Id),
                    name = GetV1MarketName(fixture.TemplateId, tradingTemplateData),
                    startTime = DateTime.Now.ToString(CultureInfo.InvariantCulture),
                    eventName = string.Empty
                };
                tradingTemplateData.RacingMarkets.Add(racingMarket);
            }
        }

        private void ConvertTv2FixtureTemplateToRacingMarket(Dictionary<string, OptionMarkets>? fixturesResponse, TradingTemplateMarkets tradingTemplate)
        {

            if (fixturesResponse != null && string.IsNullOrEmpty(tradingTemplate.TemplateIds))
            {
                tradingTemplate.RacingMarkets = new List<RacingMarket>();

                string[] listOfMarkets = tradingTemplate.MarketNames.Split(new string[] { "||" }, StringSplitOptions.None);
                foreach (string marketValues in listOfMarkets)
                {
                    foreach (KeyValuePair<string, OptionMarkets> fixture in fixturesResponse)
                    {
                        if (fixture.Value?.Parameters != null)
                        {
                            string? matchedMarket = GetV2MatchedMarket(fixture.Value.Parameters, marketValues);
                            if (matchedMarket != null)
                            {
                                RacingMarket racingMarket = new RacingMarket
                                {
                                    id = Convert.ToInt32(fixture.Value.Id),
                                    name = matchedMarket
                                };
                                tradingTemplate.RacingMarkets.Add(racingMarket);
                            }
                        }
                    }
                }
            }
        }

        private string? PrepareMarketNameForVersionOneBcp(Market market, TradingTemplateMarkets tradingTemplate)
        {
            Dictionary<string, string> keyValue = new Dictionary<string, string>();

            string[] templateIds = tradingTemplate.TemplateIds.Split('|');

            var marketNames = tradingTemplate.MarketNames.Split(new string[] { "||" }, StringSplitOptions.None);

            int templateIdIndex = Array.IndexOf(templateIds, market.TemplateId?.ToString());

            string name = marketNames[templateIdIndex];

            var marketParameters = name.Split('|');

            Dictionary<string, string> marketNameParametersDictionary =
                marketParameters.ToDictionary(s => s.Split(':')[0], s => s.Split(':')[1]);

            marketNameParametersDictionary.TryGetValue(TradingMarketDefaults.MarketNameParameters, out string? marketNameParameterOut);
            string marketName = "";

            if (marketNameParameterOut != null)
            {
                string[] marketNameParameters = marketNameParameterOut.Split(',');

                string? optionName = "";

                foreach (var marketNameParameter in marketNameParameters)
                {
                    try
                    {
                        if (marketNameParameter.Contains("Options."))
                        {
                            marketNameParameters = marketNameParameter.Split('.');
                            var option = (market.Options?.Option?
                                .Where(y => y.AggregatedVisibility?.ToLower() == marketNameParameters[1]?.ToLower()))?.MinBy(x => x.Order);

                            if (option == null)
                                return null;

                            optionName = (string?)option.GetType().GetProperty(marketNameParameters[2])?.GetValue(option, null);
                            optionName = optionName?.Replace(',', '.');
                        }
                        else
                        {
                            marketNameParameters = marketNameParameter.Split('.');

                            if (marketNameParameters.Length == 1 || market.AggregatedVisibility?.ToLower() == marketNameParameters[1]?.ToLower())
                            {
                                if (marketNameParameters[0] == TradingMarketDefaults.MarketName)
                                {
                                    marketNameParametersDictionary.TryGetValue(TradingMarketDefaults.MarketName, out string? marketDefaultName);
                                    marketName += marketDefaultName;
                                }
                                else
                                {
                                    marketName += (string?)market.GetType().GetProperty(marketNameParameters[0])?.GetValue(market, null);
                                }
                            }
                            else
                            {
                                return null;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"Exception {ex.Message}, {ex.StackTrace}");
                    }

                }

                if (!string.IsNullOrEmpty(optionName))
                {
                    marketName += "_" + optionName;
                }
            }

            return marketName;
        }

        private string GetV1MarketName(string id, TradingTemplateMarkets tradingTemplateData)
        {
            Dictionary<string, string> keyValue = new Dictionary<string, string>();

            string[] templateIds = tradingTemplateData.TemplateIds.Split('|');

            var marketNames = tradingTemplateData.MarketNames.Split(new string[] { "||" }, StringSplitOptions.None);

            int templateIdIndex = Array.IndexOf(templateIds, id);

            string name = marketNames[templateIdIndex];

            var marketParameters = name.Split('|');

            Dictionary<string, string> dictionary =
                marketParameters.ToDictionary(s => s.Split(':')[0], s => s.Split(':')[1]);

            dictionary.TryGetValue(TradingMarketDefaults.MarketName, out string? marketName);

            return marketName?.Trim() ?? string.Empty;
        }

        private string? GetV2MatchedMarket(List<FixtureParameter> parameters, string marketValues)
        {
            var marketParameters = marketValues.Split('|');

            Dictionary<string, string> dictionary =
                marketParameters.ToDictionary(s => s.Split(':')[0], s => s.Split(':')[1]);


            bool foundMatchedParameters = true;

            dictionary.TryGetValue(TradingMarketDefaults.MatchExactProperties, out string? matchExactProperties);
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

            if (foundMatchedParameters)
            {
                bool hasMarket = dictionary.TryGetValue(TradingMarketDefaults.MarketName, out string? marketName);
                bool hasDecimalValue = dictionary.TryGetValue(TradingMarketDefaults.DecimalValue, out string? decimalValue);
                if (hasMarket)
                {
                    if (hasDecimalValue)
                        return $"{marketName} {decimalValue}";
                    return marketName?.Trim();
                }
            }

            return null;
        }

        private string GetIdWithoutColon(string id)
        {
            string idWithoutColon = id;

            if (id.Contains(":"))
            {
                int index = id.IndexOf(':');

                idWithoutColon = id.Substring(index + 1, ((id.Length) - (index + 1)));
            }

            return idWithoutColon;
        }
    }
}
