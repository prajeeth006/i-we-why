using GantryTradingConnector.Shared.Business;
using GantryTradingConnector.Shared.GraphQL.Requests;
using GantryTradingConnector.Shared.Contracts.Responses.Fixture;
using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture;
using GantryTradingConnector.Shared.GraphQL.Providers;
using GantryTradingConnector.Shared.Models;
using GantryTradingConnector.Shared.Services;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using Assert = Microsoft.VisualStudio.TestTools.UnitTesting.Assert;

namespace GantryTradingConnector.Tests.Services
{
    [TestFixture]
    class MultiEventDataServiceTest
    {
        private Mock<IMultiEventDataService> _multiEventDataServiceMock;


        private IMultiEventDataService _multiEventDataService;
        private MultiEventRequest _competitionMultiEventRequest;
        private CompetitionEventRequest _competitionEventRequest;
        private FixtureInfoResponse _fixtureInfoResponse;
        private OptionMarketSlimsResponse _optionMarketSlimsResponse;

        private Mock<ILogger<MultiEventDataService>> _logger;
        private Mock<IBetContentBusiness> _betContentBusiness;
        private Mock<IBetContentProvider> _betContentProvider;

        [SetUp]
        public void SetUp()
        {
            _competitionMultiEventRequest = CompetitionMultiEventRequestModel();
            _competitionEventRequest = CompetitionEventRequestModel();
            _fixtureInfoResponse = FixtureInfoResponseModel();
            _optionMarketSlimsResponse = OptionMarketSlimsResponse();

            _logger = new Mock<ILogger<MultiEventDataService>>();
            _betContentBusiness = new Mock<IBetContentBusiness>();
            _betContentProvider = new Mock<IBetContentProvider>();
        }

       


        #region Private Method
        private MultiEventRequest CompetitionMultiEventRequestModel()
        {
            MultiEventRequest multiEventParams = new MultiEventRequest()
            {
                MultiEventParams = new List<MultiEventParams>()
                {
                    new MultiEventParams()
                    {
                        CompetitionId = 1010,
                        RegionId = 6,
                        SportId = 5
                    }
                },
                Start = 0,
                End = 0,
                TemplateIds = "62",
                Version = 1
            };

            return multiEventParams;
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
                        Value = "6"
                    },
                    new TermRequest()
                    {
                        Field = "SPORT_ID",
                        ConjunctionType=Conjunction.OR,
                        Value = "5"
                    },
                    new TermRequest()
                    {
                        Field = "COMPETITION_ID",
                        ConjunctionType=Conjunction.OR,
                        Value = "1010"
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

        private OptionMarketSlimsResponse OptionMarketSlimsResponse()
        {
            OptionMarketSlimsResponse result = new OptionMarketSlimsResponse();

            List<OptionsMarket> optionsMarkets = new List<OptionsMarket>();
            optionsMarkets.Add(new OptionsMarket { TemplateId = "62", FixtureId = "13134995" });

            List<OptionMarketSlims> optionMarketSlims = new List<OptionMarketSlims>() { new OptionMarketSlims() { Id = "13134995", CutOffDate = new CutOffDate() { DateTime = "/Date(1527269760000)/", OffsetMinutes = "0" }, TemplateId = "62", Options = optionsMarkets } };

            result.OptionMarketSlims = optionMarketSlims;

            return result;
        }

        #endregion
    }
}
