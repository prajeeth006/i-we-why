using GantryTradingConnector.Shared.Business;
using GantryTradingConnector.Shared.GraphQL.Config;
using GantryTradingConnector.Shared.Models;
using GantryTradingConnector.Shared.Services;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using NUnit.Framework;
using Assert = NUnit.Framework.Assert;

namespace GantryTradingConnector.Tests.Business
{
    [TestFixture]
    class BetContentBuisnessTest
    {
        private Mock<IBetContentDataService> _mockBetContentDataService;
        private BetContentBusiness _betContentBusiness;
        private FixtureV9Response _fixtureV9Response;
        private OptionMarketSlimsResponse _optionMarketSlimsResponse;
        private MasterRegionResponse _masterRegionsResponses;
        private MasterCompetitionResponse _masterCompetitionResponse;
        private List<MasterRegion> lstMasterRegions;
        private SportDetailResponse _sportDetails;
        private Mock<IMemoryCache> _cache;
        private Mock<IOptions<DurationConfiguration>> _durationConfiguration;
        private Mock<ILogger<BetContentBusiness>> _logger;

        [SetUp]
        public void SetUp()
        {
            _sportDetails = GetSportList();
            _fixtureV9Response = FixtureV9Response();
            _optionMarketSlimsResponse = OptionMarketSlimsResponse();
            _masterRegionsResponses = GetMasterRegionsResponse();
            _masterCompetitionResponse = GetMasterCompetitionResponse();
            lstMasterRegions = GetMasterRegions();

            _mockBetContentDataService = new Mock<IBetContentDataService>();
            _cache=new Mock<IMemoryCache>();
            _durationConfiguration = new Mock<IOptions<DurationConfiguration>>();
            _logger = new Mock<ILogger<BetContentBusiness>>();
            _betContentBusiness = new BetContentBusiness(_mockBetContentDataService.Object,_cache.Object,_durationConfiguration.Object,_logger.Object);
        }

        [Test]
        public void Should_All_Sport_Data_Not_Null()
        {

            _mockBetContentDataService.Setup(x => x.GetSportsDetails(It.IsAny<string>())).Returns(Task.FromResult(_sportDetails));

            var result = _betContentBusiness.GetSportsDetails(string.Empty);

            Assert.IsNotNull(result);
        }

        [Test]
        public void Should_All_Sport_Data_Empty()
        {

            _mockBetContentDataService.Setup(x => x.GetSportsDetails(It.IsAny<string>())).Returns(Task.FromResult(new SportDetailResponse { SportDetails = new List<SportDetail>() }));

            var result = _betContentBusiness.GetSportsDetails(string.Empty).Result as SportDetailResponse;

            Assert.IsEmpty(result.SportDetails);
        }

        [Test]
        public void Should_Fixture_V9_Response_Not_Null()
        {
            _mockBetContentDataService.Setup(x => x.GetMarketDetailForVersionTwoFixture("2:4803202", null, null, null, null, false, null)).Returns(Task.FromResult(_fixtureV9Response));

            var result = _betContentBusiness.GetMarketDetailForVersionTwoFixture("2:4803202");

            Assert.IsNotNull(result);

        }

        [Test]
        public void Should_Fixture_V9_Response_Null()
        {
            _mockBetContentDataService.Setup(x => x.GetMarketDetailForVersionTwoFixture("2:4803202", null,
                null, null, null, false, null)).Returns(Task.FromResult<FixtureV9Response>(null));

            var result = _betContentBusiness.GetMarketDetailForVersionTwoFixture("4803202");

            Assert.IsNull(result.Result);

        }

        [Test]
        public void Should_Fixture_V9_Response_Exception()
        {

            _mockBetContentDataService.Setup(x => x.GetMarketDetailForVersionTwoFixture("2:4803202", null,
                null, null, null, false, null)).ThrowsAsync(new ArgumentException("id is required!"));

            var exceptionThrown = Assert.ThrowsAsync<ArgumentException>(async () => await _betContentBusiness.GetMarketDetailForVersionTwoFixture(null));

            Assert.AreEqual("id is required!", exceptionThrown.Message);
        }

        [Test]
        public void Should_Option_Market_Slims_Details_Not_Null()
        {
            _mockBetContentDataService.Setup(x => x.GetMarketDetailForVersionOneFixture("13945282")).Returns(Task.FromResult(_optionMarketSlimsResponse));

            var result = _betContentBusiness.GetMarketDetailForVersionOneFixture("13945282",null);

            Assert.IsNotNull(result.Result.OptionMarketSlims);
        }


        [Test]
        public void Should_Option_Market_Slims_Details_Empty()
        {
            _mockBetContentDataService.Setup(x => x.GetMarketDetailForVersionOneFixture("13945282")).Returns(Task.FromResult<OptionMarketSlimsResponse>(new OptionMarketSlimsResponse { OptionMarketSlims = new List<OptionMarketSlims>() }));

            var result = _betContentBusiness.GetMarketDetailForVersionOneFixture("13945282",null);

            Assert.IsEmpty(result.Result.OptionMarketSlims);
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
            OptionMarketSlimsResponse result = new OptionMarketSlimsResponse();

            List<OptionsMarket> optionsMarkets = new List<OptionsMarket>();
            optionsMarkets.Add(new OptionsMarket{TemplateId = "1",FixtureId = "1234"});

            List<OptionMarketSlims> optionMarketSlims = new List<OptionMarketSlims>() { new OptionMarketSlims() { Id = "28176271", CutOffDate = new CutOffDate() { DateTime = "/Date(1527269760000)/", OffsetMinutes = "0" }, TemplateId = "11239",Options = optionsMarkets } };

            result.OptionMarketSlims = optionMarketSlims;

            return result;
        }

        private MasterRegionResponse GetMasterRegionsResponse()
        {
            MasterRegionResponse masterRegionResponse = new MasterRegionResponse();

            List<MasterRegion> masterRegions = new List<MasterRegion>() { new MasterRegion() { Id = "1:7", InternalId = 1, Code = "EUR", Name = new RegionName() { StringId = "1:11066", Language = "en", Value = "Europe" }, UsedInTradingPartition = new List<string> { "1", "2" } } };

            masterRegionResponse.MasterRegions = masterRegions;

            return masterRegionResponse;
        }

        private MasterCompetitionResponse GetMasterCompetitionResponse()
        {
            MasterCompetitionResponse masterCompetitionResponse = new MasterCompetitionResponse();

            List<MasterCompetition> masterCompetition = new List<MasterCompetition>() { new MasterCompetition() { Id = "1:7", InternalId = 1, Name = new CompetitionName() { StringId = "1:11066", Language = "en", Value = "Football League" } } };

            masterCompetitionResponse.MasterCompetitions = masterCompetition;

            return masterCompetitionResponse;
        }

        private List<MasterRegion> GetMasterRegions()
        {
            MasterRegion region = new MasterRegion();
            region.Id = "1:7"; region.isCompetitionsAvailableInAdvance = true;
            List<MasterRegion> lstMasterRegions = new List<MasterRegion>();
            lstMasterRegions.Add(region);
            return lstMasterRegions;
        }
        

        #endregion
    }
}
