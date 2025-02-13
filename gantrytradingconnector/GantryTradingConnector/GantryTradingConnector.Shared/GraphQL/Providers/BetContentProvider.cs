using Bwin.Sports.GraphQL.Client;
using Bwin.Sports.GraphQL.Client.QueryGenerator;
using GantryTradingConnector.Shared.Config;
using GantryTradingConnector.Shared.Contracts.Responses.Fixture;
using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture;
using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Regions;
using GantryTradingConnector.Shared.GraphQL.Requests;
using GantryTradingConnector.Shared.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Globalization;
using System.Net;
using System.Text.RegularExpressions;
using Bwin.Sports.GraphQL.Client.Extentions;
using RegionInfo = GantryTradingConnector.Shared.Contracts.Responses.Fixture.RegionInfo;
using System.Reflection.Emit;
using System.Reflection;
using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Competition;

namespace GantryTradingConnector.Shared.GraphQL.Providers
{
    public class BetContentProvider : IBetContentProvider
    {
        // private readonly IOptions<TradingApiConfiguration> _tradingApiConfig;
        private readonly IOptions<TradingContentApiConfiguration> _tcaConfig;
        // private readonly IOptions<SportsAdminApiConfiguration> _sportsAdminConfig;
        private readonly IGraphQLHttpClient _graphQlClient;
        private readonly ILogger<BetContentProvider> _logger;
        // private readonly HttpClient _tradingApiHttpClient;
        //private readonly HttpClient _tcaHttpClient;
        //private readonly HttpClient _sportsAdminClient;

        private const string Standard = "Standard";

        public BetContentProvider(
            IOptions<TradingContentApiConfiguration> tcaConfig,
            ILogger<BetContentProvider> logger,
            IGraphQLHttpClient graphQlHttpClient
            )
        {
            _tcaConfig = tcaConfig;
            // _sportsAdminConfig = sportsAdminConfig;
            _graphQlClient = graphQlHttpClient;
            _logger = logger;
            // _sportsAdminClient = httpClientFactory.CreateClient(Constants.SportsAdminApi);
        }

        #region Public Method
        /// <summary>
        /// Get search fixture detail
        /// </summary>
        /// <param name="model">Search request object</param>
        /// <returns>Fixture info</returns>
        /// <exception cref="ArgumentException"></exception>
        public async Task<FixtureInfoResponse> Search(SearchRequest model)
        {
            FixtureInfoResponse response = new FixtureInfoResponse();

            if (string.IsNullOrWhiteSpace(model.SearchValue) && model.Restriction != SearchRestriction.BetBuilder)
            {
                throw new ArgumentException($"{nameof(model.SearchValue)} is required!");
            }

            try
            {
                IEnumerable<MarketIndex> marketInfo = new List<MarketIndex>();
                var betBuilderFixtures = new List<string>();

                if (model.Restriction == SearchRestriction.BetBuilder)
                {
                    List<MarketIndex> lst = new List<MarketIndex>();

                    marketInfo = lst; //await GetBetBuilderIndexAsync();

                    betBuilderFixtures = marketInfo
                        .Select(market => market.FixtureId)
                        .Distinct()
                        .ToList();

                }

                IEnumerable<GraphQLQueryArgument> queryArguments = GetQueryArguments(model, betBuilderFixtures);

                response.UrlTradingResponse = _tcaConfig.Value.Endpoint + _tcaConfig.Value.SearchUri;

                FixtureQuery result = await _graphQlClient
                    .CreateQuery<FixtureQuery>(response.UrlTradingResponse, arguments: queryArguments.ToArray())
                    .Execute();

                if (result != null)
                {
                    response.FixtureInfo = GetMappedFixtures(result, marketInfo);

                    response.Status = HttpStatusCode.OK;
                }
                else
                {
                    response.Status = HttpStatusCode.NotFound;
                }

            }
            catch (Exception ex)
            {
                _logger.LogError($"Unable to get search results: {ex.Message}");
                throw;
            }

            return response;
        }
        
        /// <summary>
        /// Get search region info
        /// </summary>
        /// <param name="model">Region request object</param>
        /// <returns>Region info</returns>
        public async Task<RegionInfoResponse> SearchRegions(RegionRequest model)
        {
            RegionInfoResponse response = new RegionInfoResponse();

            try
            {
                Stopwatch gtcTimer = new Stopwatch();
                Stopwatch tcaTimer = new Stopwatch();

                IEnumerable<GraphQLQueryArgument> queryArguments = GetRegionQueryArguments(model);

                response.UrlTradingResponse = _tcaConfig.Value.Endpoint + _tcaConfig.Value.SearchUri;

                gtcTimer.Start();
                tcaTimer.Start();
                var regionQuery = _graphQlClient.CreateQuery<RegionQuery>(response.UrlTradingResponse, arguments: queryArguments.ToArray());
                var result = await regionQuery.Execute();
                tcaTimer.Stop();
                response.TCALatency = tcaTimer.ElapsedMilliseconds;
                response.RequestedQuery = JsonConvert.SerializeObject(queryArguments);

                if (result != null)
                {
                    var regions = GetMappedRegions(result, model);
                    response.ExcludedRegions = GetMappedRegions(result, model);

                    response.Regions.Regions = GetIncludeAndExcludeRegions(regions.Regions, model.Includes, model.Excludes);
                    response.Regions.TotalCount = response.Regions.Regions.Count;

                    if (regions?.Regions != null && response?.Regions?.Regions != null)
                    {
                        response.ExcludedRegions.Regions = response.ExcludedRegions.Regions.Where(x => !response.Regions.Regions.Exists(y => y.Name == x.Name)).ToList();
                        response.ExcludedRegions.TotalCount = response.ExcludedRegions.Regions.Count;
                    }

                    response.Status = HttpStatusCode.OK;
                }
                else
                {
                    response.Status = HttpStatusCode.NotFound;
                }

                gtcTimer.Stop();

                response.GTCLatency = gtcTimer.ElapsedMilliseconds;

                _logger.LogInformation(JsonConvert.SerializeObject(response));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unable to get search results: {ex.Message}");
                throw;
            }

            return response;
        }

        /// <summary>
        /// Get search region info
        /// </summary>
        /// <param name="model">Region request object</param>
        /// <returns>Region info</returns>
        public async Task<CompetitionInfoResponse> SearchCompetitions(CompetitionRequest model)
        {
            CompetitionInfoResponse response = new CompetitionInfoResponse();

            try
            {

                if (model?.SportId == null || model?.SportId == 0)
                {
                    throw new Exception("Please provide valid sport id.");
                }

                Stopwatch gtcTimer = new Stopwatch();
                Stopwatch tcaTimer = new Stopwatch();

                IEnumerable<GraphQLQueryArgument> queryArguments = GetCompetitionQueryArguments(model);

                response.UrlTradingResponse = _tcaConfig.Value.Endpoint + _tcaConfig.Value.SearchUri;

                gtcTimer.Start();
                tcaTimer.Start();
                var competitionQuery = _graphQlClient.CreateQuery<CompetitionQuery>(response.UrlTradingResponse, arguments: queryArguments.ToArray());
                var result = await competitionQuery.Execute();
                tcaTimer.Stop();
                response.TCALatency = tcaTimer.ElapsedMilliseconds;
                response.RequestedQuery = JsonConvert.SerializeObject(queryArguments);

                if (result != null)
                {
                    var competitions = GetMappedCompetitions(result, model);
                    response.ExcludedCompetitions = GetMappedCompetitions(result, model);

                    response.Competitions.Competitions = GetIncludeAndExcludeRegions(competitions.Competitions, model.Includes, model.Excludes);
                    response.Competitions.TotalCount = response.Competitions.Competitions.Count;

                    if (competitions?.Competitions != null && response?.Competitions?.Competitions != null)
                    {
                        response.ExcludedCompetitions.Competitions = response.ExcludedCompetitions.Competitions.Where(x => !response.Competitions.Competitions.Exists(y => y.Name == x.Name)).ToList();
                        response.ExcludedCompetitions.TotalCount = response.ExcludedCompetitions.Competitions.Count;
                    }

                    response.Status = HttpStatusCode.OK;
                }
                else
                {
                    response.Status = HttpStatusCode.NotFound;
                }

                gtcTimer.Stop();

                response.GTCLatency = gtcTimer.ElapsedMilliseconds;

                _logger.LogInformation(JsonConvert.SerializeObject(response));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unable to get search results: {ex.Message}");
                throw;
            }

            return response;
        }

        public async Task<CompetitionInfoResponse> SearchCompetitionsWithoutRegions(CompetitionWithoutRegionRequest model)
        {
            CompetitionInfoResponse response = new CompetitionInfoResponse();

            try
            {

                if (model?.SportId == null || model?.SportId == 0)
                {
                    throw new Exception("Please provide valid sport id.");
                }

                Stopwatch gtcTimer = new Stopwatch();
                Stopwatch tcaTimer = new Stopwatch();

                IEnumerable<GraphQLQueryArgument> queryArguments = GetCompetitionWithoutRegionQueryArguments(model);

                response.UrlTradingResponse = _tcaConfig.Value.Endpoint + _tcaConfig.Value.SearchUri;

                gtcTimer.Start();
                tcaTimer.Start();
                var competitionQuery = _graphQlClient.CreateQuery<CompetitionQuery>(response.UrlTradingResponse, arguments: queryArguments.ToArray());
                var result = await competitionQuery.Execute();
                tcaTimer.Stop();
                response.TCALatency = tcaTimer.ElapsedMilliseconds;
                response.RequestedQuery = JsonConvert.SerializeObject(queryArguments);

                if (result != null)
                {
                    var competitions = GetMappedCompetitionsWithoutRegions(result, model);
                    response.ExcludedCompetitions = GetMappedCompetitionsWithoutRegions(result, model);

                    response.Competitions.Competitions = GetIncludeAndExcludeRegions(competitions.Competitions, model.Includes, model.Excludes);
                    response.Competitions.TotalCount = response.Competitions.Competitions.Count;

                    if (competitions?.Competitions != null && response?.Competitions?.Competitions != null)
                    {
                        response.ExcludedCompetitions.Competitions = response.ExcludedCompetitions.Competitions.Where(x => !response.Competitions.Competitions.Exists(y => y.Name == x.Name)).ToList();
                        response.ExcludedCompetitions.TotalCount = response.ExcludedCompetitions.Competitions.Count;
                    }

                    response.Status = HttpStatusCode.OK;
                }
                else
                {
                    response.Status = HttpStatusCode.NotFound;
                }

                gtcTimer.Stop();

                response.GTCLatency = gtcTimer.ElapsedMilliseconds;

                _logger.LogInformation(JsonConvert.SerializeObject(response));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unable to get search results: {ex.Message}");
                throw;
            }

            return response;
        }

        /// <summary>
        /// Get search fixtures info
        /// </summary>
        /// <param name="model">Fixture request object</param>
        /// <returns>Fixture info</returns>
        public async Task<FixtureInfoResponse> SearchFixtures(FixtureRequest model)
        {
            FixtureInfoResponse response = new FixtureInfoResponse();

            try
            {

                if (model?.SportId == null || model?.SportId == 0)
                {
                    throw new Exception("Please provide valid sport id.");
                }
                if (model?.RegionId == null || model?.RegionId == 0)
                {
                    throw new Exception("Please provide valid region id.");
                }

                Stopwatch gtcTimer = new Stopwatch();
                Stopwatch tcaTimer = new Stopwatch();

                IEnumerable<GraphQLQueryArgument> queryArguments = GetFixtureQueryArguments(model);

                response.UrlTradingResponse = _tcaConfig.Value.Endpoint + _tcaConfig.Value.SearchUri;

                gtcTimer.Start();
                tcaTimer.Start();
                var competitionQuery = _graphQlClient.CreateQuery<FixtureQuery>(response.UrlTradingResponse, arguments: queryArguments.ToArray());
                var result = await competitionQuery.Execute();
                tcaTimer.Stop();
                response.TCALatency = tcaTimer.ElapsedMilliseconds;
                response.RequestedQuery = JsonConvert.SerializeObject(queryArguments);

                if (result != null)
                {
                    IEnumerable<MarketIndex> marketInfo = new List<MarketIndex>();

                    response.FixtureInfo = GetMappedFixtures(result, marketInfo, model);

                    response.FixtureInfo.TotalCount = response.FixtureInfo.Fixtures.Length;

                    response.Status = HttpStatusCode.OK;
                }
                else
                {
                    response.Status = HttpStatusCode.NotFound;
                }

                gtcTimer.Stop();

                response.GTCLatency = gtcTimer.ElapsedMilliseconds;

                _logger.LogInformation(JsonConvert.SerializeObject(response));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unable to get search results: {ex.Message}");
                throw;
            }

            return response;
        }

        public async Task<FixtureInfoWithoutRegionResponse> SearchFixturesWithoutRegions(FixtureWithoutRegionRequest model)
        {
            FixtureInfoWithoutRegionResponse response = new FixtureInfoWithoutRegionResponse();

            try
            {
                if (model?.SportId == null || model?.SportId == 0)
                {
                    throw new Exception("Please provide valid sport id.");
                }

                Stopwatch gtcTimer = new Stopwatch();
                Stopwatch tcaTimer = new Stopwatch();

                IEnumerable<GraphQLQueryArgument> queryArguments = GetFixtureWithoutRegionQueryArguments(model);

                response.UrlTradingResponse = _tcaConfig.Value.Endpoint + _tcaConfig.Value.SearchUri;

                gtcTimer.Start();
                tcaTimer.Start();
                var competitionQuery = _graphQlClient.CreateQuery<FixtureQuery>(response.UrlTradingResponse, arguments: queryArguments.ToArray());
                var result = await competitionQuery.Execute();
                tcaTimer.Stop();
                response.TCALatency = tcaTimer.ElapsedMilliseconds;
                response.RequestedQuery = JsonConvert.SerializeObject(queryArguments);

                if (result != null)
                {
                    IEnumerable<MarketIndex> marketInfo = new List<MarketIndex>();

                    response.FixtureInfo = GetMappedFixturesWithoutRegions(result, marketInfo, model);

                    response.FixtureInfo.TotalCount = response.FixtureInfo.Fixtures.Length;

                    response.Status = HttpStatusCode.OK;
                }
                else
                {
                    response.Status = HttpStatusCode.NotFound;
                }

                gtcTimer.Stop();

                response.GTCLatency = gtcTimer.ElapsedMilliseconds;

                _logger.LogInformation(JsonConvert.SerializeObject(response));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Unable to get search results: {ex.Message}");
                throw;
            }

            return response;
        }

        #endregion

        #region  Private Method

        /// <summary>
        /// Get Graph Query Argument
        /// </summary>
        /// <param name="model">Request model</param>
        /// <param name="fixtureIds">List of fixture ids</param>
        /// <returns>Graph query arguments</returns>
        private static IEnumerable<GraphQLQueryArgument> GetQueryArguments(SearchRequest model, IEnumerable<string> fixtureIds = null)
        {
            ConditionGroups conditionGroups = new ConditionGroups
            {
                MatchParameters = fixtureIds.Any() ? null : GetMatchParameters(model.Filter, model.SearchValue),
                TermParameters = GetTermParameters(model.Terms, fixtureIds),
                RangeParameters = GetRangeParameters(model.Ranges)
            };

            List<GraphQLQueryArgument> queryArguments = new List<GraphQLQueryArgument>
            {
                new GraphQLQueryArgument(nameof(ConditionGroups), conditionGroups),
            };

            GraphQLQueryArgument sortQueryArgument = GetSortQueryArgument(model.Sort.SortType, model.Sort.Field);

            if (sortQueryArgument != null)
            {
                queryArguments.Add(sortQueryArgument);
            }

            return queryArguments;
        }


        /// <summary>
        /// Get Region query argument
        /// </summary>
        /// <param name="region">Request region</param>
        /// <returns>Graph query arguments for region</returns>
        private static IEnumerable<GraphQLQueryArgument> GetRegionQueryArguments(RegionRequest region)
        {
            List<TermRequest> termRequests = new List<TermRequest>();
            termRequests = AddLabelIdParameter(termRequests, region.LabelId);
            termRequests = AddSportIdParameter(termRequests, region.SportId);
            var dateRanges = AddDateRangeParameter(region.StartDate, region.EndDate);
            GraphQLQueryArgument sortQueryArgument = AddSortParmaeter(region.SortType, region.SortField);
            return GetQueryArguments(termRequests, dateRanges, sortQueryArgument, region.First);
        }

        /// <summary>
        /// Get competition query argument
        /// </summary>
        /// <param name="competition">Request competition</param>
        /// <returns>Graph query arguments for competition</returns>
        private static IEnumerable<GraphQLQueryArgument> GetCompetitionQueryArguments(CompetitionRequest competition)
        {
            List<TermRequest> termRequests = new List<TermRequest>();
            termRequests = AddLabelIdParameter(termRequests, competition.LabelId);
            termRequests = AddSportIdParameter(termRequests, competition.SportId);
            termRequests = AddRegionIdParameter(termRequests, competition.RegionId);
            var dateRanges = AddDateRangeParameter(competition.StartDate, competition.EndDate);
            GraphQLQueryArgument sortQueryArgument = AddSortParmaeter(competition.SortType, competition.SortField);
            return GetQueryArguments(termRequests, dateRanges, sortQueryArgument, competition.First);
        }

        private static IEnumerable<GraphQLQueryArgument> GetCompetitionWithoutRegionQueryArguments(CompetitionWithoutRegionRequest competition)
        {
            List<TermRequest> termRequests = new List<TermRequest>();
            termRequests = AddLabelIdParameter(termRequests, competition.LabelId);
            termRequests = AddSportIdParameter(termRequests, competition.SportId);
            termRequests = AddTradingPartitionParameter(termRequests, competition.TradingPartition);
            var dateRanges = AddDateRangeParameter(competition.StartDate, competition.EndDate);
            GraphQLQueryArgument sortQueryArgument = AddSortParmaeter(competition.SortType, competition.SortField);
            return GetQueryArguments(termRequests, dateRanges, sortQueryArgument, competition.First);
        }

        /// <summary>
        /// Get fixture query argument
        /// </summary>
        /// <param name="competition">Fixture competition</param>
        /// <returns>Graph query arguments for fixtures</returns>
        private static IEnumerable<GraphQLQueryArgument> GetFixtureQueryArguments(FixtureRequest fixture)
        {
            List<TermRequest> termRequests = new List<TermRequest>();
            termRequests = AddLabelIdParameter(termRequests, fixture.LabelId);
            termRequests = AddSportIdParameter(termRequests, fixture.SportId);
            termRequests = AddRegionIdParameter(termRequests, fixture.RegionId);
            termRequests = AddCompetitionIdParameter(termRequests, fixture.CompetitionId);
            var dateRanges = AddDateRangeParameter(fixture.StartDate, fixture.EndDate);
            GraphQLQueryArgument sortQueryArgument = AddSortParmaeter(fixture.SortType, fixture.SortField);
            return GetQueryArguments(termRequests, dateRanges, sortQueryArgument, fixture.First);
        }

        private static IEnumerable<GraphQLQueryArgument> GetFixtureWithoutRegionQueryArguments(FixtureWithoutRegionRequest fixture)
        {
            List<TermRequest> termRequests = new List<TermRequest>();
            termRequests = AddLabelIdParameter(termRequests, fixture.LabelId);
            termRequests = AddSportIdParameter(termRequests, fixture.SportId);
            termRequests = AddTradingPartitionParameter(termRequests, fixture.TradingPartition);
            termRequests = AddCompetitionIdParameter(termRequests, fixture.CompetitionId);
            var dateRanges = AddDateRangeParameter(fixture.StartDate, fixture.EndDate);
            GraphQLQueryArgument sortQueryArgument = AddSortParmaeter(fixture.SortType, fixture.SortField);
            return GetQueryArguments(termRequests, dateRanges, sortQueryArgument, fixture.First);
        }

        private static IEnumerable<GraphQLQueryArgument> GetQueryArguments(List<TermRequest> termRequests, List<RangeRequest> dateRangesRequest, GraphQLQueryArgument sortParameters, int? first)
        {
            ConditionGroups conditionGroups = new ConditionGroups
            {
                TermParameters = GetTermParameters(termRequests),
                RangeParameters = GetRangeParameters(dateRangesRequest)
            };

            List<GraphQLQueryArgument> queryArguments = new List<GraphQLQueryArgument>
            {
                new GraphQLQueryArgument(nameof(ConditionGroups), conditionGroups),
            };

                queryArguments.Add(sortParameters);

            queryArguments = AddFirstParameter(queryArguments, first);

            return queryArguments;
        }


        private static List<GraphQLQueryArgument> AddFirstParameter(List<GraphQLQueryArgument> queryArguments, int? first)
        {
            queryArguments.Add(new GraphQLQueryArgument("first", first == 0 ? 10000 : first));
            return queryArguments;
        }

        private static List<TermRequest> AddLabelIdParameter(List<TermRequest> termRequest, int? labelId)
        {
            if (labelId != null && labelId != 0)
            {
                termRequest.Add(new TermRequest { Field = "LABEL_ID", ConjunctionType = Conjunction.AND, Value = Convert.ToString(labelId.Value) });
            }
            return termRequest;
        }

        private static List<TermRequest> AddSportIdParameter(List<TermRequest> termRequest, int? sportId)
        {
            if (sportId != null)
            {
                termRequest.Add(new TermRequest { Field = "SPORT_ID", ConjunctionType = Conjunction.AND, Value = Convert.ToString(sportId.Value) });
            }
            return termRequest;
        }

        private static List<TermRequest> AddRegionIdParameter(List<TermRequest> termRequest, int? regionId)
        {
            if (regionId != null)
            {
                termRequest.Add(new TermRequest { Field = "REGION_ID", ConjunctionType = Conjunction.AND, Value = Convert.ToString(regionId.Value) });
            }
            return termRequest;
        }

        private static List<TermRequest> AddCompetitionIdParameter(List<TermRequest> termRequest, int? competitionId)
        {
            if (competitionId != null)
            {
                termRequest.Add(new TermRequest { Field = "COMPETITION_ID", ConjunctionType = Conjunction.AND, Value = Convert.ToString(competitionId.Value) });
            }
            return termRequest;
        }

        private static List<TermRequest> AddTradingPartitionParameter(List<TermRequest> termRequest, string? tradingPartition)
        {
            if (tradingPartition != null)
            {
                termRequest.Add(new TermRequest { Field = "TRADING_PARTITION", ConjunctionType = Conjunction.AND, Value = Convert.ToString(tradingPartition) });
            }
            return termRequest;
        }

        private static List<RangeRequest> AddDateRangeParameter(DateTime? startDate, DateTime? endDate)
        {
            List<RangeRequest> ranges = new List<RangeRequest>();

            if (startDate != null && endDate != null)
            {
                ranges.Add(new RangeRequest { Field = "START_DATE", ConjunctionType = Conjunction.AND, Start = Convert.ToString(startDate.Value), End = Convert.ToString(endDate.Value), });
            }
            else
            {
                ranges.Add(new RangeRequest { Field = "START_DATE", ConjunctionType = Conjunction.AND, Start = Convert.ToString(DateTime.Now), End = Convert.ToString(DateTime.Now.AddDays(30)), });
            }

            return ranges;
        }

        private static GraphQLQueryArgument AddSortParmaeter(SortTypes? sortType, string? sortBy)
        {
            GraphQLQueryArgument sortQueryArgument = GetSortQueryArgument(sortType == SortTypes.ASC ? SortTypes.ASC : SortTypes.DESC, "Id");
            return sortQueryArgument;
        }


        /// <summary>
        /// Get Map regions from query result
        /// </summary>
        /// <param name="result">Region query result</param>
        /// <returns>Region info object</returns>
        private RegionInfo GetMappedRegions(RegionQuery result, RegionRequest model)
        {
            var regions = new RegionInfo
            {
                TotalCount = result.RegionTreeSearch.Regions.TotalCount,
                PageInfo = new PageInfoResponse
                {
                    EndCursor = result.RegionTreeSearch.Regions.PageInfo.EndCursor,
                    HasNextPage = result.RegionTreeSearch.Regions.PageInfo.HasNextPage,
                    HasPreviousPage = result.RegionTreeSearch.Regions.PageInfo.HasPreviousPage,
                    StartCursor = result.RegionTreeSearch.Regions.PageInfo.StartCursor
                },
                Regions = result.RegionTreeSearch.Regions.Edges.Select(region => new RegionResponse()
                {
                    Id = region.Node.Id,
                    Name = region.Node.Name

                }).ToList()

            };
            if (regions.Regions != null && regions.Regions.Any() && model.SortField?.ToLower() == "name")
            {
                regions.Regions = model.SortType == SortTypes.ASC ? regions.Regions.OrderBy(x => x.Name).ToList() : regions.Regions.OrderByDescending(x => x.Name).ToList();
            }
            return regions;
        }


        /// <summary>
        /// Get Map regions from query result
        /// </summary>
        /// <param name="result">Region query result</param>
        /// <returns>Region info object</returns>
        private CompetitionInfo GetMappedCompetitions(CompetitionQuery result, CompetitionRequest model)
        {
            var competitions = new CompetitionInfo
            {
                TotalCount = result.CompetitionTreeSearch.Competitions.TotalCount,
                PageInfo = new PageInfoResponse
                {
                    EndCursor = result.CompetitionTreeSearch.Competitions.PageInfo.EndCursor,
                    HasNextPage = result.CompetitionTreeSearch.Competitions.PageInfo.HasNextPage,
                    HasPreviousPage = result.CompetitionTreeSearch.Competitions.PageInfo.HasPreviousPage,
                    StartCursor = result.CompetitionTreeSearch.Competitions.PageInfo.StartCursor
                },
                Competitions = result.CompetitionTreeSearch.Competitions.Edges.Select(competition => new CompetitionResponse()
                {
                    Id = competition.Node.Id,
                    Name = competition.Node.Name,
                    IsLive = competition.Node.IsLive
                }).Where(competition =>
                {
                    if (model.IsLive == null) return true;
                    return competition.IsLive == model.IsLive;

                }).ToList()

            };
            if (competitions.Competitions != null && competitions.Competitions.Any() && model.SortField?.ToLower() == "name")
            {
                competitions.Competitions = model.SortType == SortTypes.ASC ? competitions.Competitions.OrderBy(x => x.Name).ToList() : competitions.Competitions.OrderByDescending(x => x.Name).ToList();
            }
            return competitions;
        }

        /// <summary>
        /// Get Map regions from query result
        /// </summary>
        /// <param name="result">Region query result</param>
        /// <returns>Region info object</returns>
        private CompetitionInfo GetMappedCompetitionsWithoutRegions(CompetitionQuery result, CompetitionWithoutRegionRequest model)
        {
            var competitions = new CompetitionInfo
            {
                TotalCount = result.CompetitionTreeSearch.Competitions.TotalCount,
                PageInfo = new PageInfoResponse
                {
                    EndCursor = result.CompetitionTreeSearch.Competitions.PageInfo.EndCursor,
                    HasNextPage = result.CompetitionTreeSearch.Competitions.PageInfo.HasNextPage,
                    HasPreviousPage = result.CompetitionTreeSearch.Competitions.PageInfo.HasPreviousPage,
                    StartCursor = result.CompetitionTreeSearch.Competitions.PageInfo.StartCursor
                },
                Competitions = result.CompetitionTreeSearch.Competitions.Edges.Select(competition => new CompetitionResponse()
                {
                    Id = competition.Node.Id,
                    Name = competition.Node.Name,
                    IsLive = competition.Node.IsLive
                }).Where(competition =>
                {
                    if (model.IsLive == null) return true;
                    return competition.IsLive == model.IsLive;

                }).ToList()

            };
            if (competitions.Competitions != null && competitions.Competitions.Any() && model.SortField?.ToLower() == "name")
            {
                competitions.Competitions = model.SortType == SortTypes.ASC ? competitions.Competitions.OrderBy(x => x.Name).ToList() : competitions.Competitions.OrderByDescending(x => x.Name).ToList();
            }
            return competitions;
        }

        /// <summary>
        /// Get region after include and exclude
        /// </summary>
        /// <param name="regions"></param>
        /// <param name="includeRegions"></param>
        /// <param name="excludeRegions"></param>
        /// <returns>Regions list</returns>
        private List<T> GetIncludeAndExcludeRegions<T>(List<T> regions, string? includeRegions, string? excludeRegions)
        {

            if (!string.IsNullOrEmpty(includeRegions))
            {
                if (!string.IsNullOrEmpty(includeRegions))
                {
                    var includeElement = Convert.ToString(includeRegions.Trim()).ToLower().Split(',').ToList();

                    regions = GetMatchingRegions(regions, includeElement, false);
                }
            }

            if (!string.IsNullOrEmpty(excludeRegions) && regions.Any())
            {
                if (!string.IsNullOrEmpty(includeRegions))
                {
                    var includeElement = Convert.ToString(includeRegions.Trim()).ToLower().Split(',').ToList();

                    var excludeElement = Convert.ToString(excludeRegions.Trim()).ToLower().Split(',').ToList();

                    var differenceElement = excludeElement.Except(includeElement).ToList();

                    regions = GetMatchingRegions(regions, differenceElement, true);
                }
                else
                {

                    var excludeElement = Convert.ToString(excludeRegions.Trim()).ToLower().Split(',').ToList();

                    regions = GetMatchingRegions(regions, excludeElement, true);
                }
            }

            return regions;
        }

        /// <summary>
        ///  Get matching regions list
        /// </summary>
        /// <param name="regions">List of Regions</param>
        /// <param name="matchingRegionElement">Include Exclude matching regions</param>
        /// <param name="isExclude">Is Exclude</param>
        /// <returns>Filter regions List</returns>
        private List<T> GetMatchingRegions<T>(List<T> regions, List<string> matchingRegionElement, bool isExclude = false)
        {
            List<T> newRegions = new List<T>();

            if (matchingRegionElement.Count == 0)
            {
                return regions;
            }

            if (isExclude)
            {
                newRegions = regions.Where(x => !matchingRegionElement.Exists(y => Regex.IsMatch(((string)x.GetType().GetProperty("Name").GetValue(x)).ToLower().Trim(), y.Trim(), RegexOptions.IgnoreCase))).ToList();
            }
            else
            {
                newRegions = regions.Where(x => matchingRegionElement.Exists(y => Regex.IsMatch(((string)x.GetType().GetProperty("Name").GetValue(x)).ToLower().Trim(), y.Trim(), RegexOptions.IgnoreCase))).ToList();
            }
            return newRegions;
        }

        /// <summary>
        /// Get match parameter for graph query
        /// </summary>
        /// <param name="searchFiled">Search field object</param>
        /// <param name="searchValue">Search value</param>
        /// <returns>Matched parameters</returns>
        private static IEnumerable<MatchParameter> GetMatchParameters(SearchField? searchFiled, string? searchValue)
        {
            var filters = searchFiled.HasValue ?
                new[] { Enum.GetName(typeof(SearchField), searchFiled) } : // Input filter
                Enum.GetNames(typeof(SearchField)); // All filters

            var matchParameters = new List<MatchParameter>();

            if (searchFiled == SearchField.COMPETITION_NAME)
            {
                var competitionMatchInput = new MatchParameter
                {
                    Field = Enum.GetName(typeof(SearchField), SearchField.COMPETITION_NAME),
                    Value = searchValue,
                    Conjunction = Conjunction.OR.ToString()
                };

                var meetingMatchInput = new MatchParameter
                {
                    Field = Enum.GetName(typeof(SearchField), SearchField.MEETING_NAME),
                    Value = searchValue,
                    Conjunction = Conjunction.OR.ToString()
                };

                matchParameters.Add(competitionMatchInput);
                matchParameters.Add(meetingMatchInput);
            }
            else
            {
                matchParameters.AddRange(
                    filters.Select(filter => new MatchParameter
                    {
                        Field = filter,
                        Value = searchValue,
                        Conjunction = filters.Length == 1 ?
                            Conjunction.AND.ToString() :
                            Conjunction.OR.ToString(),
                    }));
            }

            return matchParameters;
        }

        /// <summary>
        /// Get term parameters 
        /// </summary>
        /// <param name="terms">List of terms request</param>
        /// <param name="fixtureIds">List of fixture Ids</param>
        /// <returns>List of term parameter</returns>
        private static IEnumerable<TermParameter> GetTermParameters(IEnumerable<TermRequest> terms, IEnumerable<string> fixtureIds = null)
        {
            var termParameters = terms?.Select(term => new TermParameter
            {
                Field = term.Field,
                Value = term.Value,
                Conjunction = Enum.GetName(typeof(Conjunction), term.ConjunctionType)
            });

            if (fixtureIds != null && fixtureIds.Any())
            {
                var betBuilderTerm = fixtureIds.Select(fixtureId => new TermParameter
                {
                    Field = "ID",
                    Value = fixtureId,
                    Conjunction = Conjunction.OR.ToString()
                });

                return termParameters.Union(betBuilderTerm);
            }

            return termParameters;
        }

        /// <summary>
        /// Get range parameters
        /// </summary>
        /// <param name="ranges">List of ranges</param>
        /// <returns>List of range parameters</returns>
        private static IEnumerable<RangeParameter> GetRangeParameters(IEnumerable<RangeRequest> ranges)
        {
            IEnumerable<RangeParameter> rangeParameters = ranges?.Select(range => new RangeParameter
            {
                Field = range.Field,
                Start = (string.IsNullOrEmpty(range.Start) ? DateTime.UtcNow.Date : DateTime.Parse(range.Start))
                    .ToString(CultureInfo.InvariantCulture),
                End = string.IsNullOrWhiteSpace(range.End) ? null : range.End,
                Conjunction = Enum.GetName(typeof(Conjunction), range.ConjunctionType)
            });

            return rangeParameters;
        }

        /// <summary>
        /// Get sort query arguments
        /// </summary>
        /// <param name="sortType">Sort type as Asc or Desc</param>
        /// <param name="sortField">Sort field</param>
        /// <returns>Graph query argument</returns>
        private static GraphQLQueryArgument GetSortQueryArgument(SortTypes sortType, string sortField)
        {
            var sortParameters = new SortParameter
            {
                Sort = Enum.GetName(typeof(SortTypes), sortType),
                Field = sortField
            };

            var sortQueryArgument = new GraphQLQueryArgument(nameof(SortParameter), sortParameters);

            return sortQueryArgument;
        }

        /// <summary>
        /// Get Map fixtures
        /// </summary>
        /// <param name="result">Fixture query result</param>
        /// <param name="betBuilderMarketInfo">Market info object</param>
        /// <returns>Fixture info object</returns>
        private static FixtureInfo GetMappedFixtures(FixtureQuery result, IEnumerable<MarketIndex> betBuilderMarketInfo, FixtureRequest model=null)
        {
            var fixtures = new FixtureInfo
            {
                TotalCount = result.FixtureSearch.Fixtures.TotalCount,
                PageInfo = new PageInfoResponse
                {
                    EndCursor = result.FixtureSearch.Fixtures.PageInfo.EndCursor,
                    HasNextPage = result.FixtureSearch.Fixtures.PageInfo.HasNextPage,
                    HasPreviousPage = result.FixtureSearch.Fixtures.PageInfo.HasPreviousPage,
                    StartCursor = result.FixtureSearch.Fixtures.PageInfo.StartCursor
                },
                Fixtures = result.FixtureSearch.Fixtures.Edges.Select(fixture => new FixtureResponse
                {
                    Id = fixture.Node.Id,
                    Name = fixture.Node.Name,
                    EndDate = fixture.Node.EndDate,
                    StartDate = fixture.Node.StartDate,
                    IsInPlay = fixture.Node.IsInPlay,
                    TradingPartitionId = fixture.Node.TradingPartitionId,
                    IsBetbuilder = fixture.Node.FixtureType == Standard || betBuilderMarketInfo.Any(),
                    Competition = new CompetitionResponse { Id = fixture.Node.CompetitionId.ToString(), Name = fixture.Node.CompetitionName },
                    Meeting = new MeetingResponse { Id = fixture.Node.MeetingId.ToString(), Name = fixture.Node.MeetingName },
                    Region = new RegionResponse { Id = fixture.Node.RegionId.ToString(), Name = fixture.Node.RegionName },
                    Sport = new SportResponse { Id = fixture.Node.SportId.ToString(), Name = fixture.Node.SportName },
                    BetBuilderMarkets = betBuilderMarketInfo.Where(market => market.FixtureId == fixture.Node.Id).Select(m => m.Id).ToArray(),
                    EventId = betBuilderMarketInfo.Where(market => market.FixtureId == fixture.Node.Id).Select(m => m.EventId).FirstOrDefault(),
                    FixtureType = fixture.Node.FixtureType
                }).ToArray()
            };

            if (fixtures.Fixtures != null && fixtures.Fixtures.Any())
            {
                if (!string.IsNullOrEmpty(model?.FixtureType))
                {
                    fixtures.Fixtures = fixtures.Fixtures.Where(x => string.IsNullOrEmpty(x.FixtureType) || (x.FixtureType?.ToLower().Trim().Equals(model?.FixtureType?.ToLower().Trim()) ?? false)).ToArray();
                }
                if (model?.IsInPlay != null)
                {
                    fixtures.Fixtures = fixtures.Fixtures.Where(x => x.IsInPlay.Equals(model.IsInPlay)).ToArray();
                }
                if (model?.SortField?.ToLower() == "name")
                {
                    fixtures.Fixtures = model.SortType == SortTypes.ASC ? fixtures.Fixtures.OrderBy(x => x.Name).ToArray() : fixtures.Fixtures.OrderByDescending(x => x.Name).ToArray();
                } else if(model?.SortField?.ToLower() == "startdate")
                {
                    fixtures.Fixtures = model.SortType == SortTypes.ASC ? fixtures.Fixtures.OrderBy(x => x.StartDate).ThenBy(o => o.Name).ToArray() : fixtures.Fixtures.OrderByDescending(x => x.StartDate).ThenBy(o => o.Name).ToArray();
                }
                else if (model?.SortField?.ToLower() == "enddate")
                {
                    fixtures.Fixtures = model.SortType == SortTypes.ASC ? fixtures.Fixtures.OrderBy(x => x.EndDate).ThenBy(o => o.Name).ToArray() : fixtures.Fixtures.OrderByDescending(x => x.EndDate).ThenBy(o => o.Name).ToArray();
                }

            }

            return fixtures;
        }

        private static FixtureInfoWithoutRegion GetMappedFixturesWithoutRegions(FixtureQuery result, IEnumerable<MarketIndex> betBuilderMarketInfo, FixtureWithoutRegionRequest model = null)
        {
            var fixtures = new FixtureInfoWithoutRegion
            {
                TotalCount = result.FixtureSearch.Fixtures.TotalCount,
                PageInfo = new PageInfoResponse
                {
                    EndCursor = result.FixtureSearch.Fixtures.PageInfo.EndCursor,
                    HasNextPage = result.FixtureSearch.Fixtures.PageInfo.HasNextPage,
                    HasPreviousPage = result.FixtureSearch.Fixtures.PageInfo.HasPreviousPage,
                    StartCursor = result.FixtureSearch.Fixtures.PageInfo.StartCursor
                },
                Fixtures = result.FixtureSearch.Fixtures.Edges.Select(fixture => new FixtureWithoutRegionResponse
                {
                    Id = fixture.Node.Id,
                    Name = fixture.Node.Name,
                    EndDate = fixture.Node.EndDate,
                    StartDate = fixture.Node.StartDate,
                    IsInPlay = fixture.Node.IsInPlay,
                    TradingPartitionId = fixture.Node.TradingPartitionId,
                    IsBetbuilder = fixture.Node.FixtureType == Standard || betBuilderMarketInfo.Any(),
                    Competition = new CompetitionResponse { Id = fixture.Node.CompetitionId.ToString(), Name = fixture.Node.CompetitionName },
                    Meeting = new MeetingResponse { Id = fixture.Node.MeetingId?.ToString(), Name = fixture.Node.MeetingName },
                    Sport = new SportResponse { Id = fixture.Node.SportId.ToString(), Name = fixture.Node.SportName },
                    BetBuilderMarkets = betBuilderMarketInfo.Where(market => market.FixtureId == fixture.Node.Id).Select(m => m.Id).ToArray(),
                    EventId = betBuilderMarketInfo.Where(market => market.FixtureId == fixture.Node.Id).Select(m => m.EventId).FirstOrDefault(),
                    FixtureType = fixture.Node.FixtureType
                }).ToArray()
            };

            if (fixtures.Fixtures != null && fixtures.Fixtures.Any())
            {
                if (!string.IsNullOrEmpty(model?.FixtureType))
                {
                    fixtures.Fixtures = fixtures.Fixtures.Where(x => string.IsNullOrEmpty(x.FixtureType) || (x.FixtureType?.ToLower().Trim().Equals(model?.FixtureType?.ToLower().Trim()) ?? false)).ToArray();
                }
                if (model?.IsInPlay != null)
                {
                    fixtures.Fixtures = fixtures.Fixtures.Where(x => x.IsInPlay.Equals(model.IsInPlay)).ToArray();
                }
                if (model?.SortField?.ToLower() == "name")
                {
                    fixtures.Fixtures = model.SortType == SortTypes.ASC ? fixtures.Fixtures.OrderBy(x => x.Name).ToArray() : fixtures.Fixtures.OrderByDescending(x => x.Name).ToArray();
                }
                else if (model?.SortField?.ToLower() == "startdate")
                {
                    fixtures.Fixtures = model.SortType == SortTypes.ASC ? fixtures.Fixtures.OrderBy(x => x.StartDate).ThenBy(o => o.Name).ToArray() : fixtures.Fixtures.OrderByDescending(x => x.StartDate).ThenBy(o => o.Name).ToArray();
                }
                else if (model?.SortField?.ToLower() == "enddate")
                {
                    fixtures.Fixtures = model.SortType == SortTypes.ASC ? fixtures.Fixtures.OrderBy(x => x.EndDate).ThenBy(o => o.Name).ToArray() : fixtures.Fixtures.OrderByDescending(x => x.EndDate).ThenBy(o => o.Name).ToArray();
                }

            }

            return fixtures;
        }

        #endregion
    }
}
