using GantryTradingConnector.Shared.Business;
using GantryTradingConnector.Shared.GraphQL.Requests;
using GantryTradingConnector.Shared.Contracts.Responses.Fixture;
using GantryTradingConnector.Shared.GraphQL.Config;
using GantryTradingConnector.Shared.GraphQL.Providers;
using GantryTradingConnector.Shared.Models;
using GantryTradingConnector.Shared.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace GantryTradingConnector.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GantryTradingController : ControllerBase
    {
        private readonly ILogger<GantryTradingController> _logger;

        private readonly IBetContentBusiness _betContentBusiness;

        private readonly IBetContentProvider _betContentProvider;

        private readonly IMultiEventDataService _multiEventDataService;

        private readonly IOptions<DurationConfiguration> _tcaConfig;

        public GantryTradingController(ILogger<GantryTradingController> logger, IBetContentBusiness betContentBusiness, IBetContentProvider betContentProvider, IMultiEventDataService multiEventDataService, IOptions<DurationConfiguration> tcaConfig)
        {
            _logger = logger;
            _betContentBusiness = betContentBusiness;
            _betContentProvider = betContentProvider;
            _multiEventDataService = multiEventDataService;
            _tcaConfig = tcaConfig;
        }

        [HttpGet]
        [Route("GetAllSports")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> GetSportDataAsync(string? label)
        {
            SportDetailResponse sportDetails = await _betContentBusiness.GetSportsDetails(label);

            return Ok(sportDetails);
        }

        [HttpPost]
        [Route("GetRegions")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> GetRegions(RegionRequest model)
        {
            RegionInfoResponse result = await _betContentProvider.SearchRegions(model);

            return Ok(result);
        }

        [HttpPost]
        [Route("GetCompetitions")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> GetCompetitions(CompetitionRequest model)
        {
            CompetitionInfoResponse result = await _betContentProvider.SearchCompetitions(model);

            return Ok(result);
        }
       
        [HttpPost]
        [Route("GetCompetitionsWithoutRegions")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> GetCompetitionsWithoutRegions(CompetitionWithoutRegionRequest model)
        {
            CompetitionInfoResponse result = await _betContentProvider.SearchCompetitionsWithoutRegions(model);

            return Ok(result);
        }

        [HttpPost]
        [Route("GetFixturesNew")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> GetFixtures(FixtureRequest model)
        {
            FixtureInfoResponse result = await _betContentProvider.SearchFixtures(model);

            return Ok(result);
        }

        [HttpPost]
        [Route("GetFixturesNewWithoutRegions")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> GetFixturesWithoutRegions(FixtureWithoutRegionRequest model)
        {
            FixtureInfoWithoutRegionResponse result = await _betContentProvider.SearchFixturesWithoutRegions(model);

            return Ok(result);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="fixtureId"></param>
        /// <returns></returns>

        [HttpGet]
        [Route("GetMarketDetailForVersionOneFixture/{fixtureId}")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> GetMarketDetailForVersionOneFixture(string fixtureId, string? templateId = null)
        {
            OptionMarketSlimsResponse betContentResponse = await _betContentBusiness.GetMarketDetailForVersionOneFixture(fixtureId, templateId);

            return Ok(betContentResponse);
        }

        [HttpGet]
        [Route("GetMarketDetailForVersionOneFixtureBCP/{fixtureId}")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> GetMarketDetailForVersionOneFixtureBCP(string fixtureId, string? templateId = null)
        {
            Event bpcResponse = await _betContentBusiness.GetMarketDetailForVersionOneFixtureBCP(fixtureId, templateId);

            return Ok(bpcResponse);
        }

        [HttpGet]
        [Route("GetMarketDetailForVersionTwoFixture/{fixtureId}")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> GetMarketDetailForVersionTwoFixture(string fixtureId, string? optionMarketIds = null, string? label = null, string? country = null, string? language = null, bool? skipMarketFilter = null, int? shopTier = null)
        {
            FixtureV9Response betContentResponse = await _betContentBusiness.GetMarketDetailForVersionTwoFixture(fixtureId, optionMarketIds, label, country, language, skipMarketFilter, shopTier);

            return Ok(betContentResponse);
        }


        [HttpGet]
        [Route("GetMarketDetailForVersionOneOrVersionTwoFixture/{fixtureId}/{version}")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> GetMarketDetailForVersionOneOrVersionTwoFixture(string fixtureId, string version, string? templateId = null, string? optionMarketIds = null, string? label = null, string? country = null, string? language = null, bool? skipMarketFilter = null, int? shopTier = null)
        {
            string[] strArray = fixtureId.Split(':').ToArray();

            if (strArray.Length > 1 && version != "v1")
            {
                FixtureV9Response betContentResponse = await _betContentBusiness.GetMarketDetailForVersionTwoFixture(fixtureId, optionMarketIds, label, country, language, skipMarketFilter, shopTier);

                return Ok(betContentResponse);
            }
            else
            {
                OptionMarketSlimsResponse betContentResponse = await _betContentBusiness.GetMarketDetailForVersionOneFixture(fixtureId, templateId);

                return Ok(betContentResponse);
            }
        }

        [HttpPost]
        [Route("GetMultiEventsBasedOnMarketForVersionOneOrTwoNew")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> GetMultiEventsBasedOnMarketForVersionOneOrTwoNew([Bind(nameof(MultiEventRequest.MultiEventParams), nameof(MultiEventRequest.Version), nameof(MultiEventRequest.Markets), nameof(MultiEventRequest.TemplateIds), nameof(MultiEventRequest.Start), nameof(MultiEventRequest.End))] MultiEventRequest multiEventRequest)
        {
            if (multiEventRequest.Version == 2)
            {
                return Ok(await _multiEventDataService.GetMultiEventsBasedOnVersion2_New(multiEventRequest));
            }
            return Ok(await _multiEventDataService.GetMultiEventsBasedOnVersion1_New(multiEventRequest));
        }
    }
}
