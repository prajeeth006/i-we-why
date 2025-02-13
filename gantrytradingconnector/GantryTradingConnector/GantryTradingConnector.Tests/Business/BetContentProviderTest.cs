using Bwin.Sports.GraphQL.Client;
using Bwin.Sports.GraphQL.Client.QueryGenerator;
using GantryTradingConnector.Shared.Config;
using GantryTradingConnector.Shared.GraphQL.Requests;
using GantryTradingConnector.Shared.Contracts.Responses.Fixture;
using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Competition;
using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture;
using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Regions;
using GantryTradingConnector.Shared.GraphQL.Providers;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Newtonsoft.Json;
using NUnit.Framework;
using Assert = NUnit.Framework.Assert;

namespace GantryTradingConnector.Tests.Business
{
    [TestFixture]
    class BetContentProviderTest
    {
        private Mock<IOptions<TradingContentApiConfiguration>> _tcaConfig;
        private TradingContentApiConfiguration _tcaConfigValue;
        // private Mock<IOptions<SportsAdminApiConfiguration>> _sportsAdminConfig;
        private Mock<ILogger<BetContentProvider>> _logger;
        private Mock<IHttpClientFactory> _httpClient;
        private Mock<IGraphQLHttpClient> _graphQlClient;
        //private Mock<HttpClient> _sportsAdminClient;
        private BetContentProvider _betContentProvider;
        private SearchRequest _searchRequest;
        private CompetitionEventRequest _competitionEventRequest;
        private FixtureRequest _fixtureRequest;
        private FixtureInfoResponse _fixtureInfoResponse;
        private RegionQuery _regionQuery;
        private CompetitionQuery _competitionQuery;
        private RegionRequest _regionRequest;
        private CompetitionRequest _competitionRequest;
        private Mock<IGraphQLQuery<FixtureQuery>> _graphQlQueryClient;
        private Mock<IGraphQLQuery<RegionQuery>> _graphQlRegionQuery;
        private Mock<IGraphQLQuery<CompetitionQuery>> _graphQlCompetitionQuery;

        [SetUp]
        public void SetUp()
        {
            _searchRequest = SearchRequestModel();
            _fixtureInfoResponse = FixtureInfoResponseModel();
            _competitionEventRequest = CompetitionEventRequestModel();
            _regionQuery = GetRegionQueryResult();
            _competitionQuery = GetCompetitionQueryResult();
            _regionRequest = RegionRequestModel();
            _competitionRequest = CompetitionRequestModel();
            _fixtureRequest = GetFixtureRequest();
            _tcaConfig = new Mock<IOptions<TradingContentApiConfiguration>>();
            _tcaConfigValue = new TradingContentApiConfiguration { Endpoint = string.Empty, SearchUri = string.Empty };
            // _sportsAdminConfig = new Mock<IOptions<SportsAdminApiConfiguration>>();
            _graphQlClient = new Mock<IGraphQLHttpClient>();
            _logger = new Mock<ILogger<BetContentProvider>>();
            // _sportsAdminClient = new Mock<HttpClient>();
            _httpClient = new Mock<IHttpClientFactory>();
            _graphQlQueryClient = new Mock<IGraphQLQuery<FixtureQuery>>();
            _graphQlRegionQuery = new Mock<IGraphQLQuery<RegionQuery>>();
            _graphQlCompetitionQuery = new Mock<IGraphQLQuery<CompetitionQuery>>();
            _tcaConfig.Setup(x => x.Value).Returns(_tcaConfigValue);
        }

        [Test]
        public void Search_Data_Not_Null()
        {
            FixtureQuery fixtureQueryResult = JsonConvert.DeserializeObject<FixtureQuery>(
                "{\"FixtureSearch\":{\"Conditions\":null,\"Sort\":null,\"Fixtures\":{\"First\":0,\"After\":null,\"Edges\":[{\"Node\":{\"Id\":\"2:13134995\",\"Name\":\"CBIT_Fixture_0_133222471367512194\",\"CompetitionName\":\"Bath\",\"CompetitionId\":16,\"EndDate\":\"2023 - 03 - 16T16: 12:16Z\",\"StartDate\":\"2023 - 03 - 16T16: 12:16Z\",\"MeetingId\":16,\"SportId\":29,\"RegionId\":220,\"RegionName\":\"United Kingdom\",\"MeetingName\":\"Bath\",\"SportName\":\"Horse Racing\",\"IsInPlay\":false,\"IsPlannedInPlay\":false,\"FixtureType\":\"Antepost\"}}],\"PageInfo\":{\"EndCursor\":\"[1677953640000]\",\"HasNextPage\":true,\"HasPreviousPage\":false,\"StartCursor\":null},\"TotalCount\":340}}}");

            _graphQlClient.Setup(x => x.CreateQuery<FixtureQuery>(string.Empty
                , null, "Bearer", It.IsAny<GraphQLQueryArgument[]>())).Returns(_graphQlQueryClient.Object);

            _graphQlQueryClient.Setup(x => x.Execute()).Returns(Task.FromResult(fixtureQueryResult));

            _betContentProvider = new BetContentProvider(_tcaConfig.Object, _logger.Object, _graphQlClient.Object);

            var result = _betContentProvider.Search(_searchRequest);

            Assert.IsNotNull(result);
        }



        [Test]
        public void Search_Data_Null_Reference_Exception()
        {
            _graphQlClient.Setup(x => x.CreateQuery<FixtureQuery>(string.Empty
                , null, "Bearer", It.IsAny<GraphQLQueryArgument[]>())).Returns(_graphQlQueryClient.Object);

            _graphQlQueryClient.Setup(x => x.Execute()).Returns(Task.FromResult<FixtureQuery>(new FixtureQuery()));

            _betContentProvider = new BetContentProvider(_tcaConfig.Object, _logger.Object, _graphQlClient.Object);

            Assert.ThrowsAsync<NullReferenceException>(async () => await _betContentProvider.Search(_searchRequest));
        }

        [Test]
        public void Get_Regions_Not_Null()
        {

            _graphQlClient.Setup(x => x.CreateQuery<RegionQuery>(string.Empty
                , null, "Bearer", It.IsAny<GraphQLQueryArgument[]>())).Returns(_graphQlRegionQuery.Object);

            _graphQlRegionQuery.Setup(x => x.Execute()).Returns(Task.FromResult(_regionQuery));

            _betContentProvider = new BetContentProvider(_tcaConfig.Object, _logger.Object, _graphQlClient.Object);

            var result = _betContentProvider.SearchRegions(_regionRequest);

            Assert.IsNotNull(result);
        }

        [Test]
        public void Get_Competitions_Not_Null()
        {

            _graphQlClient.Setup(x => x.CreateQuery<CompetitionQuery>(string.Empty
                , null, "Bearer", It.IsAny<GraphQLQueryArgument[]>())).Returns(_graphQlCompetitionQuery.Object);

            _graphQlCompetitionQuery.Setup(x => x.Execute()).Returns(Task.FromResult(_competitionQuery));

            _betContentProvider = new BetContentProvider(_tcaConfig.Object, _logger.Object, _graphQlClient.Object);

            var result = _betContentProvider.SearchCompetitions(_competitionRequest);

            Assert.IsNotNull(result);
        }

        [Test]
        public void Get_Region_Null_Reference_Exception()
        {
            _graphQlClient.Setup(x => x.CreateQuery<RegionQuery>(string.Empty
                , null, "Bearer", It.IsAny<GraphQLQueryArgument[]>())).Returns(_graphQlRegionQuery.Object);

            _graphQlRegionQuery.Setup(x => x.Execute()).Returns(Task.FromResult<RegionQuery>(new RegionQuery()));

            _betContentProvider = new BetContentProvider(_tcaConfig.Object, _logger.Object, _graphQlClient.Object);

            Assert.ThrowsAsync<NullReferenceException>(async () => await _betContentProvider.SearchRegions(_regionRequest));
        }


       

      
        
        [Test]
        public void Get_Competition_Events_With_PairGameFixtures()
        {
            FixtureQuery fixtureQueryResult = JsonConvert.DeserializeObject<FixtureQuery>(
                "{\"FixtureSearch\":{\"Conditions\":null,\"Sort\":null,\"Fixtures\":{\"First\":0,\"After\":null,\"Edges\":[{\"Node\":{\"Id\":\"2:13134995\",\"Name\":\"CBIT_Fixture_0_133222471367512194\",\"CompetitionName\":\"Bath\",\"CompetitionId\":16,\"EndDate\":\"2023 - 03 - 16T16: 12:16Z\",\"StartDate\":\"2023 - 03 - 16T16: 12:16Z\",\"MeetingId\":16,\"SportId\":29,\"RegionId\":220,\"RegionName\":\"United Kingdom\",\"MeetingName\":\"Bath\",\"SportName\":\"Horse Racing\",\"IsInPlay\":false,\"IsPlannedInPlay\":false,\"FixtureType\":\"PairGame\"}},{\"Node\":{\"Id\":\"2:13134995\",\"Name\":\"CBIT_Fixture_0_133222471367512194\",\"CompetitionName\":\"Bath\",\"CompetitionId\":16,\"EndDate\":\"2023 - 03 - 16T16: 12:16Z\",\"StartDate\":\"2023 - 03 - 16T16: 12:16Z\",\"MeetingId\":16,\"SportId\":29,\"RegionId\":220,\"RegionName\":\"United Kingdom\",\"MeetingName\":\"Bath\",\"SportName\":\"Horse Racing\",\"IsInPlay\":false,\"IsPlannedInPlay\":false,\"FixtureType\":\"\"}}],\"PageInfo\":{\"EndCursor\":\"[1677953640000]\",\"HasNextPage\":true,\"HasPreviousPage\":false,\"StartCursor\":null},\"TotalCount\":340}}}");

            _graphQlClient.Setup(x => x.CreateQuery<FixtureQuery>(string.Empty
                , null, "Bearer", It.IsAny<GraphQLQueryArgument[]>())).Returns(_graphQlQueryClient.Object);

            _graphQlQueryClient.Setup(x => x.Execute()).Returns(Task.FromResult(fixtureQueryResult));

            _betContentProvider = new BetContentProvider(_tcaConfig.Object, _logger.Object, _graphQlClient.Object);
            _fixtureRequest.FixtureType = "PairGame";

            var result = _betContentProvider.SearchFixtures(_fixtureRequest);
            var fixtures = result.Result?.FixtureInfo?.Fixtures;
            if (fixtures != null )
            {
                Assert.AreEqual(fixtures[0].FixtureType, "PairGame");
                Assert.AreEqual(fixtures[1].FixtureType , "");
            }
        }

        [Test]
        public void Get_Competition_Events_With_TournamentFixtures()
        {
            FixtureQuery fixtureQueryResult = JsonConvert.DeserializeObject<FixtureQuery>(
                "{\"FixtureSearch\":{\"Conditions\":null,\"Sort\":null,\"Fixtures\":{\"First\":0,\"After\":null,\"Edges\":[{\"Node\":{\"Id\":\"2:13134995\",\"Name\":\"CBIT_Fixture_0_133222471367512194\",\"CompetitionName\":\"Bath\",\"CompetitionId\":16,\"EndDate\":\"2023 - 03 - 16T16: 12:16Z\",\"StartDate\":\"2023 - 03 - 16T16: 12:16Z\",\"MeetingId\":16,\"SportId\":29,\"RegionId\":220,\"RegionName\":\"United Kingdom\",\"MeetingName\":\"Bath\",\"SportName\":\"Horse Racing\",\"IsInPlay\":false,\"IsPlannedInPlay\":false,\"FixtureType\":\"tournament\"}},{\"Node\":{\"Id\":\"2:13134995\",\"Name\":\"CBIT_Fixture_0_133222471367512194\",\"CompetitionName\":\"Bath\",\"CompetitionId\":16,\"EndDate\":\"2023 - 03 - 16T16: 12:16Z\",\"StartDate\":\"2023 - 03 - 16T16: 12:16Z\",\"MeetingId\":16,\"SportId\":29,\"RegionId\":220,\"RegionName\":\"United Kingdom\",\"MeetingName\":\"Bath\",\"SportName\":\"Horse Racing\",\"IsInPlay\":false,\"IsPlannedInPlay\":false,\"FixtureType\":\"\"}}],\"PageInfo\":{\"EndCursor\":\"[1677953640000]\",\"HasNextPage\":true,\"HasPreviousPage\":false,\"StartCursor\":null},\"TotalCount\":340}}}");

            _graphQlClient.Setup(x => x.CreateQuery<FixtureQuery>(string.Empty
                , null, "Bearer", It.IsAny<GraphQLQueryArgument[]>())).Returns(_graphQlQueryClient.Object);

            _graphQlQueryClient.Setup(x => x.Execute()).Returns(Task.FromResult(fixtureQueryResult));

            _betContentProvider = new BetContentProvider(_tcaConfig.Object, _logger.Object, _graphQlClient.Object);
            _fixtureRequest.FixtureType = "Tournament";

            var result = _betContentProvider.SearchFixtures(_fixtureRequest);
            var fixtures = result.Result?.FixtureInfo?.Fixtures;
            if (fixtures != null)
            {
                Assert.AreEqual(fixtures[0].FixtureType, "tournament");
                Assert.AreEqual(fixtures[1].FixtureType, "");
            }
        }

        [Test]
        public void Get_Competition_Events_With_NullTypeFixtures()
        {
            FixtureQuery fixtureQueryResult = JsonConvert.DeserializeObject<FixtureQuery>(
                "{\"FixtureSearch\":{\"Conditions\":null,\"Sort\":null,\"Fixtures\":{\"First\":0,\"After\":null,\"Edges\":[{\"Node\":{\"Id\":\"2:13134995\",\"Name\":\"CBIT_Fixture_0_133222471367512194\",\"CompetitionName\":\"Bath\",\"CompetitionId\":16,\"EndDate\":\"2023 - 03 - 16T16: 12:16Z\",\"StartDate\":\"2023 - 03 - 16T16: 12:16Z\",\"MeetingId\":16,\"SportId\":29,\"RegionId\":220,\"RegionName\":\"United Kingdom\",\"MeetingName\":\"Bath\",\"SportName\":\"Horse Racing\",\"IsInPlay\":false,\"IsPlannedInPlay\":false,\"FixtureType\":\"\"}},{\"Node\":{\"Id\":\"2:13134995\",\"Name\":\"CBIT_Fixture_0_133222471367512194\",\"CompetitionName\":\"Bath\",\"CompetitionId\":16,\"EndDate\":\"2023 - 03 - 16T16: 12:16Z\",\"StartDate\":\"2023 - 03 - 16T16: 12:16Z\",\"MeetingId\":16,\"SportId\":29,\"RegionId\":220,\"RegionName\":\"United Kingdom\",\"MeetingName\":\"Bath\",\"SportName\":\"Horse Racing\",\"IsInPlay\":false,\"IsPlannedInPlay\":false,\"FixtureType\":\"\"}}],\"PageInfo\":{\"EndCursor\":\"[1677953640000]\",\"HasNextPage\":true,\"HasPreviousPage\":false,\"StartCursor\":null},\"TotalCount\":340}}}");

            _graphQlClient.Setup(x => x.CreateQuery<FixtureQuery>(string.Empty
                , null, "Bearer", It.IsAny<GraphQLQueryArgument[]>())).Returns(_graphQlQueryClient.Object);

            _graphQlQueryClient.Setup(x => x.Execute()).Returns(Task.FromResult(fixtureQueryResult));

            _betContentProvider = new BetContentProvider(_tcaConfig.Object, _logger.Object, _graphQlClient.Object);
            _fixtureRequest.FixtureType = "";

            var result = _betContentProvider.SearchFixtures(_fixtureRequest);
            var fixtures = result.Result?.FixtureInfo?.Fixtures;
            if (fixtures != null)
            {
                Assert.AreEqual(fixtures[0].FixtureType, "");
                Assert.AreEqual(fixtures[1].FixtureType, "");
            }
        }
        [Test]
        public void Get_Competition_Events_With_IsNotInPlayFixtures()
        {
            FixtureQuery fixtureQueryResult = JsonConvert.DeserializeObject<FixtureQuery>(
                "{\"FixtureSearch\":{\"Conditions\":null,\"Sort\":null,\"Fixtures\":{\"First\":0,\"After\":null,\"Edges\":[{\"Node\":{\"Id\":\"2:13134995\",\"Name\":\"CBIT_Fixture_0_133222471367512194\",\"CompetitionName\":\"Bath\",\"CompetitionId\":16,\"EndDate\":\"2023 - 03 - 16T16: 12:16Z\",\"StartDate\":\"2023 - 03 - 16T16: 12:16Z\",\"MeetingId\":16,\"SportId\":29,\"RegionId\":220,\"RegionName\":\"United Kingdom\",\"MeetingName\":\"Bath\",\"SportName\":\"Horse Racing\",\"IsInPlay\":false,\"IsPlannedInPlay\":false,\"FixtureType\":\"\"}},{\"Node\":{\"Id\":\"2:13134995\",\"Name\":\"CBIT_Fixture_0_133222471367512194\",\"CompetitionName\":\"Bath\",\"CompetitionId\":16,\"EndDate\":\"2023 - 03 - 16T16: 12:16Z\",\"StartDate\":\"2023 - 03 - 16T16: 12:16Z\",\"MeetingId\":16,\"SportId\":29,\"RegionId\":220,\"RegionName\":\"United Kingdom\",\"MeetingName\":\"Bath\",\"SportName\":\"Horse Racing\",\"IsInPlay\":false,\"IsPlannedInPlay\":false,\"FixtureType\":\"\"}}],\"PageInfo\":{\"EndCursor\":\"[1677953640000]\",\"HasNextPage\":true,\"HasPreviousPage\":false,\"StartCursor\":null},\"TotalCount\":340}}}");

            _graphQlClient.Setup(x => x.CreateQuery<FixtureQuery>(string.Empty
                , null, "Bearer", It.IsAny<GraphQLQueryArgument[]>())).Returns(_graphQlQueryClient.Object);

            _graphQlQueryClient.Setup(x => x.Execute()).Returns(Task.FromResult(fixtureQueryResult));

            _betContentProvider = new BetContentProvider(_tcaConfig.Object, _logger.Object, _graphQlClient.Object);
            _fixtureRequest.IsInPlay = false;

            var result = _betContentProvider.SearchFixtures(_fixtureRequest);
            var fixtures = result.Result?.FixtureInfo?.Fixtures;
            if (fixtures != null)
            {
                Assert.AreEqual(fixtures[0].IsInPlay, false);
            }
        }
        [Test]
        public void Get_Competition_Events_With_IsInPlayFixtures()
        {
            FixtureQuery fixtureQueryResult = JsonConvert.DeserializeObject<FixtureQuery>(
                "{\"FixtureSearch\":{\"Conditions\":null,\"Sort\":null,\"Fixtures\":{\"First\":0,\"After\":null,\"Edges\":[{\"Node\":{\"Id\":\"2:13134995\",\"Name\":\"CBIT_Fixture_0_133222471367512194\",\"CompetitionName\":\"Bath\",\"CompetitionId\":16,\"EndDate\":\"2023 - 03 - 16T16: 12:16Z\",\"StartDate\":\"2023 - 03 - 16T16: 12:16Z\",\"MeetingId\":16,\"SportId\":29,\"RegionId\":220,\"RegionName\":\"United Kingdom\",\"MeetingName\":\"Bath\",\"SportName\":\"Horse Racing\",\"IsInPlay\":true,\"IsPlannedInPlay\":false,\"FixtureType\":\"\"}},{\"Node\":{\"Id\":\"2:13134995\",\"Name\":\"CBIT_Fixture_0_133222471367512194\",\"CompetitionName\":\"Bath\",\"CompetitionId\":16,\"EndDate\":\"2023 - 03 - 16T16: 12:16Z\",\"StartDate\":\"2023 - 03 - 16T16: 12:16Z\",\"MeetingId\":16,\"SportId\":29,\"RegionId\":220,\"RegionName\":\"United Kingdom\",\"MeetingName\":\"Bath\",\"SportName\":\"Horse Racing\",\"IsInPlay\":false,\"IsPlannedInPlay\":false,\"FixtureType\":\"\"}}],\"PageInfo\":{\"EndCursor\":\"[1677953640000]\",\"HasNextPage\":true,\"HasPreviousPage\":false,\"StartCursor\":null},\"TotalCount\":340}}}");

            _graphQlClient.Setup(x => x.CreateQuery<FixtureQuery>(string.Empty
                , null, "Bearer", It.IsAny<GraphQLQueryArgument[]>())).Returns(_graphQlQueryClient.Object);

            _graphQlQueryClient.Setup(x => x.Execute()).Returns(Task.FromResult(fixtureQueryResult));

            _betContentProvider = new BetContentProvider(_tcaConfig.Object, _logger.Object, _graphQlClient.Object);
            _fixtureRequest.IsInPlay = true;

            var result = _betContentProvider.SearchFixtures(_fixtureRequest);
            var fixtures = result.Result?.FixtureInfo?.Fixtures;
            if (fixtures != null)
            {
                Assert.AreEqual(fixtures[0].IsInPlay, true);
            }
        }

        [Test]
        public void Get_Competition_Events_With_IsInPlayFixtures_Null()
        {
            FixtureQuery fixtureQueryResult = JsonConvert.DeserializeObject<FixtureQuery>(
                "{\"FixtureSearch\":{\"Conditions\":null,\"Sort\":null,\"Fixtures\":{\"First\":0,\"After\":null,\"Edges\":[{\"Node\":{\"Id\":\"2:13134995\",\"Name\":\"CBIT_Fixture_0_133222471367512194\",\"CompetitionName\":\"Bath\",\"CompetitionId\":16,\"EndDate\":\"2023 - 03 - 16T16: 12:16Z\",\"StartDate\":\"2023 - 03 - 16T16: 12:16Z\",\"MeetingId\":16,\"SportId\":29,\"RegionId\":220,\"RegionName\":\"United Kingdom\",\"MeetingName\":\"Bath\",\"SportName\":\"Horse Racing\",\"IsInPlay\":true,\"IsPlannedInPlay\":false,\"FixtureType\":\"\"}},{\"Node\":{\"Id\":\"2:13134995\",\"Name\":\"CBIT_Fixture_0_133222471367512194\",\"CompetitionName\":\"Bath\",\"CompetitionId\":16,\"EndDate\":\"2023 - 03 - 16T16: 12:16Z\",\"StartDate\":\"2023 - 03 - 16T16: 12:16Z\",\"MeetingId\":16,\"SportId\":29,\"RegionId\":220,\"RegionName\":\"United Kingdom\",\"MeetingName\":\"Bath\",\"SportName\":\"Horse Racing\",\"IsInPlay\":false,\"IsPlannedInPlay\":false,\"FixtureType\":\"\"}}],\"PageInfo\":{\"EndCursor\":\"[1677953640000]\",\"HasNextPage\":true,\"HasPreviousPage\":false,\"StartCursor\":null},\"TotalCount\":340}}}");

            _graphQlClient.Setup(x => x.CreateQuery<FixtureQuery>(string.Empty
                , null, "Bearer", It.IsAny<GraphQLQueryArgument[]>())).Returns(_graphQlQueryClient.Object);

            _graphQlQueryClient.Setup(x => x.Execute()).Returns(Task.FromResult(fixtureQueryResult));

            _betContentProvider = new BetContentProvider(_tcaConfig.Object, _logger.Object, _graphQlClient.Object);
            _fixtureRequest.IsInPlay = null;

            var result = _betContentProvider.SearchFixtures(_fixtureRequest);
            var fixtures = result.Result?.FixtureInfo?.Fixtures;
            if (fixtures != null)
            {
                Assert.AreEqual(fixtures[0].IsInPlay, true);
            }
        }

        #region Private Method
        private SearchRequest SearchRequestModel()
        {
            SearchRequest searchRequest = new SearchRequest()
            {
                SearchValue = "bahrain",
                Filter = null,
                Sort = new SortRequest()
                {
                    SortType = 0,
                    Field = "START_DATE"
                },
                Terms = new TermRequest[]
                {
                    new TermRequest()
                    {
                        Field = "LABEL_ID",
                        ConjunctionType=Conjunction.OR,
                        Value = "63"
                    }
                },
                Ranges = new RangeRequest[]
                {
                    new RangeRequest()
                    {
                        Field = "START_DATE",
                        ConjunctionType =Conjunction.AND,
                        Start = "2023-01-01",
                        End = "2023-12-31"
                    }
                },
                Restriction = 0
            };

            return searchRequest;

        }

        private RegionQuery GetRegionQueryResult()
        {
            RegionQuery regionQuery = new RegionQuery();

            RegionSearch regionSearch = new RegionSearch()
            {
                Regions = new RegionConnection()
                {
                    Edges = new RegionEdge[]
                   {
                       new RegionEdge()
                       {
                           Node = new Region()
                           {
                               Name = "World",
                               Id="6"
                           }
                       }
                   },
                    PageInfo = new PageInfo()
                    {
                        StartCursor = "1",
                        EndCursor = "1",
                        HasNextPage = false,
                        HasPreviousPage = false
                    },
                    TotalCount = 1
                },
                Conditions = new ConditionGroups(),
                Sort = new SortParameter(),

            };


            regionQuery.RegionTreeSearch = regionSearch;

            return regionQuery;
        }


        private CompetitionQuery GetCompetitionQueryResult()
        {
            CompetitionQuery competitionQuery = new CompetitionQuery();

            CompetitionSearch competitionSearch = new CompetitionSearch()
            {
                Competitions = new CompetitionConnection()
                {
                    Edges = new CompetitionEdge[]
                    {
                        new CompetitionEdge()
                        {
                            Node = new Competition()
                            {
                                Name = "FA CUP",
                                Id="6",
                                IsLive = true
                            }
                        }
                    },
                    PageInfo = new PageInfo()
                    {
                        StartCursor = "1",
                        EndCursor = "1",
                        HasNextPage = false,
                        HasPreviousPage = false
                    },
                    TotalCount = 1
                },
                Conditions = new ConditionGroups(),
                Sort = new SortParameter(),

            };

            competitionQuery.CompetitionTreeSearch = competitionSearch;

            return competitionQuery;
        }

        
        private FixtureInfoResponse FixtureInfoResponseModel()
        {
            FixtureInfoResponse fixtureInfoResponse = new FixtureInfoResponse();

            FixtureInfo fixtureInfo = new FixtureInfo()
            {
                Fixtures = new FixtureResponse[]
            {
                new FixtureResponse()
                {
                    EndDate = Convert.ToDateTime("2023-03-16T16:12:16Z"),
                    StartDate = Convert.ToDateTime("2023-03-16T16:12:16Z"),
                    IsInPlay = false,
                    Competition = new CompetitionResponse()
                    {
                        Id = "16",
                        Name = "bath"
                    },
                    Meeting = new MeetingResponse()
                    {
                        Id = "16",
                        Name = "Bath"
                    },
                    Region = new RegionResponse()
                    {
                        Id = "202",
                        Name = "United Kingdom"
                    },
                    Sport = new SportResponse()
                    {
                        Id = "29",
                        Name = "Horse Racing"
                    },
                    BetBuilderMarkets = new long[] { },
                    IsBetbuilder = false,
                    EventId = null,
                    Id = "2:13134995",
                    Name = "Fixture_0_133222471367512194"
                }
            }
            };

            fixtureInfoResponse.FixtureInfo = fixtureInfo;

            return fixtureInfoResponse;
        }
        private CompetitionEventRequest CompetitionEventRequestModel()
        {
            CompetitionEventRequest competitionEventRequest = new CompetitionEventRequest()
            {
                Filter = null,
                Sort = new SortRequest()
                {
                    SortType = 0,
                    Field = "START_DATE"
                },
                Terms = new TermRequest[]
                {
                    new TermRequest()
                    {
                        Field = "Region_ID",
                        ConjunctionType=Conjunction.OR,
                        Value = "14"
                    },
                    new TermRequest()
                    {
                        Field = "SPORT_ID",
                        ConjunctionType=Conjunction.OR,
                        Value = "4"
                    },
                    new TermRequest()
                    {
                        Field = "COMPETITION_ID",
                        ConjunctionType=Conjunction.OR,
                        Value = "2003"
                    }
                },
                Ranges = new RangeRequest[]
                {
                    new RangeRequest()
                    {
                        Field = "START_DATE",
                        ConjunctionType =Conjunction.AND,
                        Start = "2023-01-01",
                        End = "2023-12-31"
                    }
                },
                Restriction = 0
            };

            return competitionEventRequest;

        }
        private FixtureRequest GetFixtureRequest()
        {
            FixtureRequest fixtureRequest = new FixtureRequest()
            {
                SportId = 4,
                RegionId = 14,
                CompetitionId = 2003,
                StartDate = new DateTime(2023, 1, 1),
                EndDate = new DateTime(2029, 1, 1),
            };

            return fixtureRequest;

        }

        private RegionRequest RegionRequestModel()
        {
            RegionRequest regionRequest = new RegionRequest() { SportId = 34, LabelId = 63 };

            return regionRequest;
        }
        private CompetitionRequest CompetitionRequestModel()
        {
            CompetitionRequest competitionRequest = new CompetitionRequest() { SportId = 34, LabelId = 63, RegionId = 4, IsLive = true};

            return competitionRequest;
        }
        #endregion
    }
}
