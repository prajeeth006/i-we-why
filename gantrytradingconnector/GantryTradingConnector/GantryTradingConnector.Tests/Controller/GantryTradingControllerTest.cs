using GantryTradingConnector.Shared.Business;
using GantryTradingConnector.Controllers;
using GantryTradingConnector.Shared.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using Assert = NUnit.Framework.Assert;
using GantryTradingConnector.Shared.GraphQL.Providers;
using GantryTradingConnector.Shared.GraphQL.Requests;
using GantryTradingConnector.Shared.Contracts.Responses.Fixture;
using GantryTradingConnector.Shared.GraphQL.Config;
using GantryTradingConnector.Shared.Services;
using Microsoft.Extensions.Options;
using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture;

namespace GantryTradingConnector.Tests.Controller
{
    [TestFixture]
    class GantryTradingControllerTest
    {
        private Mock<ILogger<GantryTradingController>> _logger;
        private Mock<IBetContentBusiness> _betContentBusiness;
        private Mock<IBetContentProvider> _betContentProvider;
        private Mock<IMultiEventDataService> _multiEventDataService;
        private GantryTradingController _betContentController;
        private FixtureV9Response _fixtureV9Response;
        private OptionMarketSlimsResponse _optionMarketSlimsResponses;
        private Event _event;
        private MasterRegionResponse _masterRegionResponses;
        private MasterCompetitionResponse _masterCompetitionResponse;
        private SportDetailResponse _sportDetails;
        private RegionRequest _regionRequest;
        private CompetitionRequest _competitionRequest;
        private FixtureInfoResponse _fixtureInfoResponse;
        private CompetitionEventRequest _competitionEventRequest;
        private MultiEventRequest _competitionMultiEventRequest;
        private DurationConfiguration _durationConfiguration;
        private RegionInfoResponse _regionInfoResponse;
        private CompetitionInfoResponse _competitionInfoResponse;
        private Mock<IOptions<DurationConfiguration>> _tcaConfig;

        [SetUp]
        public void SetUp()
        {
            _sportDetails = GetSportList();
            _masterCompetitionResponse = GetMasterCompetitionResponse();
            _fixtureV9Response = FixtureV9Response();
            _optionMarketSlimsResponses = OptionMarketSlimsResponse();
            _event = EventResponse();
            _masterRegionResponses = GetMasterRegionsResponse();
            _fixtureInfoResponse = FixtureInfoResponseModel();
            _competitionEventRequest = CompetitionEventRequestModel();
            _competitionMultiEventRequest = CompetitionMultiEventRequestModel();
            _durationConfiguration = GetTcaConfiguration();
            _regionInfoResponse = GetRegionInfoResponseModel();
            _competitionInfoResponse = GetCompetitionInfoResponseModel();
            _regionRequest = RegionRequestModel();
            _competitionRequest = CompetitionRequestModel();

            _logger = new Mock<ILogger<GantryTradingController>>();
            _betContentBusiness = new Mock<IBetContentBusiness>();
            _betContentProvider = new Mock<IBetContentProvider>();
            _multiEventDataService = new Mock<IMultiEventDataService>();
            _tcaConfig = new Mock<IOptions<DurationConfiguration>>();
            _tcaConfig.Setup(x => x.Value).Returns(_durationConfiguration);
            _betContentController = new GantryTradingController(_logger.Object, _betContentBusiness.Object, _betContentProvider.Object, _multiEventDataService.Object, _tcaConfig.Object);
        }

        [Test]
        public void Should_All_Sport_Data_Not_Null()
        {
            _betContentBusiness.Setup(x => x.GetSportsDetails(It.IsAny<string>())).Returns(Task.FromResult(_sportDetails));

            var result = _betContentController.GetSportDataAsync(string.Empty);

            Assert.IsNotNull(result.Result);
        }

        [Test]
        public void Should_All_Sport_Data_Null()
        {
            _betContentBusiness.Setup(x => x.GetSportsDetails(It.IsAny<string>())).Returns(Task.FromResult(new SportDetailResponse()));

            var result = _betContentController.GetSportDataAsync(string.Empty).Result as SportDetailResponse;

            Assert.IsNull(result);
        }

        [Test]
        public void Should_Get_Region_Not_Null()
        {
            _betContentProvider.Setup(x => x.SearchRegions(_regionRequest)).Returns(Task.FromResult<RegionInfoResponse>(_regionInfoResponse));

            var result = _betContentController.GetRegions(_regionRequest);

            Assert.IsNotNull(result.Result);
        }

        [Test]
        public void Should_Get_Competition_Not_Null()
        {
            _betContentProvider.Setup(x => x.SearchCompetitions(_competitionRequest)).Returns(Task.FromResult<CompetitionInfoResponse>(_competitionInfoResponse));

            var result = _betContentController.GetCompetitions(_competitionRequest);

            Assert.IsNotNull(result.Result);
        }

        [Test]
        public void Should_Get_Region_Null()
        {
            _betContentProvider.Setup(x => x.SearchRegions(_regionRequest)).Returns(Task.FromResult<RegionInfoResponse>(new RegionInfoResponse()));

            var result = _betContentController.GetRegions(_regionRequest).Result as RegionInfoResponse;

            Assert.IsNull(result?.Regions);
        }

        [Test]
        public void Should_Get_Competition_Null()
        {
            _betContentProvider.Setup(x => x.SearchCompetitions(_competitionRequest)).Returns(Task.FromResult<CompetitionInfoResponse>(new CompetitionInfoResponse()));

            var result = _betContentController.GetRegions(_competitionRequest).Result as CompetitionInfoResponse;

            Assert.IsNull(result?.Competitions);
        }

        [Test]
        public void Should_Market_Detail_For_Version_Two_Fixture_Response_Not_Null()
        {
            _betContentBusiness.Setup(x => x.GetMarketDetailForVersionTwoFixture("2:4803202", null, null, null, null, false, null)).Returns(Task.FromResult(_fixtureV9Response));

            var result = _betContentController.GetMarketDetailForVersionTwoFixture("2:4803202");

            Assert.IsNotNull(result.Result);
        }

        [Test]
        public void Should_Market_Detail_For_Version_Two_Fixture_Response_Null()
        {
            _betContentBusiness.Setup(x => x.GetMarketDetailForVersionTwoFixture("2:4803202", null,
                null, null, null, false, null)).Returns(Task.FromResult<FixtureV9Response>(null));

            var result = _betContentController.GetMarketDetailForVersionTwoFixture("4803202").Result as OkObjectResult;

            Assert.IsNull(result.Value);
        }

        [Test]
        public void Should_Market_Detail_For_Version_One_Fixture_Response_Not_Null()
        {
            _betContentBusiness.Setup(x => x.GetMarketDetailForVersionOneFixture("13945282", null)).Returns(Task.FromResult(_optionMarketSlimsResponses));

            var result = _betContentController.GetMarketDetailForVersionOneFixture("13945282", null);

            Assert.IsNotNull(result.Result);
        }

        [Test]
        public void Should_Market_Detail_For_Version_One_Fixture_New_Response_Not_Null()
        {
            _betContentBusiness.Setup(x => x.GetMarketDetailForVersionOneFixtureBCP("100001", null)).Returns(Task.FromResult(_event));

            var result = _betContentController.GetMarketDetailForVersionOneFixtureBCP("100001", null);

            Assert.IsNotNull(result.Result);
        }

        [Test]
        public void Should_Market_Detail_For_Version_One_Fixture_Response_Null()
        {
            _betContentBusiness.Setup(x => x.GetMarketDetailForVersionOneFixture("13945282", null)).Returns(Task.FromResult<OptionMarketSlimsResponse>(new OptionMarketSlimsResponse { OptionMarketSlims = new List<OptionMarketSlims>() }));

            var result = _betContentController.GetMarketDetailForVersionOneFixture("13945282", null).Result as OptionMarketSlimsResponse;

            Assert.IsNull(result);
        }



        [Test]
        public void Should_Market_Detail_For_Version_One_Fixture_New_Response_Null()
        {
            _betContentBusiness.Setup(x => x.GetMarketDetailForVersionOneFixtureBCP("100001", null)).Returns(Task.FromResult(new Event()));

            var result = _betContentController.GetMarketDetailForVersionOneFixtureBCP("100001", null);

            Assert.IsNotNull(result.Result);
        }

        [Test]
        public void Should_Get_Market_Detail_For_Version_One_Fixture_Response_Not_Null()
        {
            _betContentBusiness.Setup(x => x.GetMarketDetailForVersionOneFixture("13945282", null)).Returns(Task.FromResult(_optionMarketSlimsResponses));

            var result = _betContentController.GetMarketDetailForVersionOneOrVersionTwoFixture("13945282", "v1", null);

            Assert.IsNotNull(result.Result);
        }

        [Test]
        public void Should_Get_Market_Detail_For_Version_Two_Fixture_Response_Not_Null()
        {
            _betContentBusiness.Setup(x => x.GetMarketDetailForVersionTwoFixture("2:4803202", null, null, null, null, false, null)).Returns(Task.FromResult(_fixtureV9Response));

            var result = _betContentController.GetMarketDetailForVersionOneOrVersionTwoFixture("2:4803202", "v2", null);

            Assert.IsNotNull(result.Result);
        }

      

      

        #region Private Method

        private SportDetailResponse GetSportList()
        {
            SportDetailResponse sportDetailResponse = new SportDetailResponse();

            sportDetailResponse.SportDetails = new List<SportDetail>() { new SportDetail() { Id = 1, Name = new SportsName { Value = "Football" } } };

            return sportDetailResponse;
        }

        private FixtureV9Response FixtureV9Response()
        {
            FixtureV9Response fixtureV9Response = new FixtureV9Response() { FixtureV9Data = new FixtureV9Data() { Id = "2:4803202", Tags = new List<FixtureTag>() { new FixtureTag() { Type = "Sport", Value = 101, Name = new Dictionary<string, string>() { { "StringId", "123" } } } } } };

            return fixtureV9Response;
        }

        private OptionMarketSlimsResponse OptionMarketSlimsResponse()
        {
            OptionMarketSlimsResponse optionMarketSlimsResponse = new OptionMarketSlimsResponse();

            List<OptionsMarket> optionsMarkets = new List<OptionsMarket>();
            optionsMarkets.Add(new OptionsMarket { TemplateId = "1", FixtureId = "1234" });

            List<OptionMarketSlims> optionMarketSlims = new List<OptionMarketSlims>() { new OptionMarketSlims() { Id = "28176271", CutOffDate = new CutOffDate() { DateTime = "/Date(1527269760000)/", OffsetMinutes = "0" }, TemplateId = "11239", Options = optionsMarkets } };

            optionMarketSlimsResponse.OptionMarketSlims = optionMarketSlims;

            return optionMarketSlimsResponse;
        }

        private Event EventResponse()
        {
            Event eventData = new Event();
            Markets markets  = new Markets();
            List<Market> market = new List<Market>();
            Shared.Models.Options options  = new Shared.Models.Options();
            List<Option> option = new List<Option>();

            option.Add(new Option(){Name = "Option1",AggregatedVisibility = "true", FormattedName = "F Option1", Id = 1002, Order = 1});

            market.Add(new Market { Id = 100001, IsLive = false, Name = "Match Result", TemplateId = 103, AggregatedVisibility = "true", CategoryFormattedName = "", CategoryName = "", Options = options });
            markets = new Markets() {Market = market};
            eventData.Markets = markets;

            return eventData;
        }
        


        private MasterRegionResponse GetMasterRegionsResponse()
        {
            MasterRegionResponse masterRegionResponse = new MasterRegionResponse();

            masterRegionResponse.MasterRegions = new List<MasterRegion>() { new MasterRegion() { Id = "2:7", InternalId = 1, Code = "EUR", Name = new RegionName() { StringId = "1:11066", Language = "en", Value = "Europe" }, UsedInTradingPartition = new List<string> { "1", "2" } } };

            return masterRegionResponse;
        }

        private MasterCompetitionResponse GetMasterCompetitionResponse()
        {
            MasterCompetitionResponse masterCompetitionResponse = new MasterCompetitionResponse();

            masterCompetitionResponse.MasterCompetitions = new List<MasterCompetition>() { new MasterCompetition() { Id = "7", InternalId = 1, Name = new CompetitionName() { StringId = "2:11066", Language = "en", Value = "Football League" } } };

            return masterCompetitionResponse;
        }


        private RegionInfoResponse GetRegionInfoResponseModel()
        {
            RegionInfoResponse regionInfoResponse = new RegionInfoResponse();

            RegionInfo regionInfo = new RegionInfo()
            {
                Regions = new List<RegionResponse>
                {
                    new RegionResponse()
                    {
                        Id = "6",
                        Name = "World"
                    }
                }
            };

            regionInfoResponse.Regions = regionInfo;

            return regionInfoResponse;
        }


        private CompetitionInfoResponse GetCompetitionInfoResponseModel()
        {
            CompetitionInfoResponse competitionInfoResponse = new CompetitionInfoResponse();

            CompetitionInfo competitionInfo = new CompetitionInfo()
            {
                Competitions = new List<CompetitionResponse>
                {
                    new CompetitionResponse()
                    {
                        Id = "102802",
                        Name = "FA Cup"
                    }
                }
            };

            competitionInfoResponse.Competitions = competitionInfo;

            return competitionInfoResponse;
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

        private RegionRequest RegionRequestModel()
        {
            RegionRequest regionRequest = new RegionRequest() { SportId = 34, LabelId = 63 };

            return regionRequest;
        }

        private CompetitionRequest CompetitionRequestModel()
        {
            CompetitionRequest regionRequest = new CompetitionRequest() { SportId = 34, LabelId = 63, RegionId = 4};

            return regionRequest;
        }


        private MultiEventRequest CompetitionMultiEventRequestModel()
        {
            MultiEventRequest multiEventParams = new MultiEventRequest()
            {
                MultiEventParams = new List<MultiEventParams>()
                {
                    new MultiEventParams()
                    {
                        CompetitionId = 1,
                        RegionId = 1,
                        SportId = 1
                    }
                },
                Start = 0,
                End = 0,
                TemplateIds = "62",
                Version = 1
            };

            return multiEventParams;
        }

        private DurationConfiguration GetTcaConfiguration()
        {
            DurationConfiguration durationConfiguration = new DurationConfiguration()
            {
                NumberOfDays = 30,
                CacheTimeOutInMinutes = 1
            };

            return durationConfiguration;
        }


        #endregion

    }
}
