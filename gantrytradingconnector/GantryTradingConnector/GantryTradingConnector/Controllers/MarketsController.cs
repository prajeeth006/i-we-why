using GantryTradingConnector.Shared.Business;
using GantryTradingConnector.Shared.Contracts.Responses.Fixture;
using GantryTradingConnector.Shared.GraphQL.Config;
using GantryTradingConnector.Shared.GraphQL.Providers;
using GantryTradingConnector.Shared.GraphQL.Requests;
using GantryTradingConnector.Shared.Models;
using GantryTradingConnector.Shared.Models.MarketModels;
using GantryTradingConnector.Shared.Services;
using GantryTradingConnector.Shared.Services.MarketService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace GantryTradingConnector.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MarketsController : ControllerBase
    {
        private readonly ILogger<MarketsController> _logger;
        private readonly IMarketContentService _marketContentService;
        private readonly IMarketMultiEventContentService _marketMultiEventContentService;
        public MarketsController(ILogger<MarketsController> logger, IMarketContentService marketContentService, IMarketMultiEventContentService marketMultiEventContentService)
        {
            _logger = logger;
            _marketContentService = marketContentService;
            _marketMultiEventContentService = marketMultiEventContentService;
        }


        [HttpPost]
        [Route("GetMarkets")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> GetMarkets(MarketRequest marketRequest)
        {
            MarketResponse racingMarkets = await _marketContentService.GetMarkets(marketRequest);

            return Ok(racingMarkets);
        }

        [HttpPost]
        [Route("GetMultiEventMarkets")]
        [ApiVersion("1.0")]
        public async Task<IActionResult> GetMultiEventMarkets(MultiEventRequest multiEventRequest)
        {
            IList<RacingEvent> racingMarkets = await _marketMultiEventContentService.GetMultiEventMarkets(multiEventRequest);

            return Ok(racingMarkets);
        }

    }
}
