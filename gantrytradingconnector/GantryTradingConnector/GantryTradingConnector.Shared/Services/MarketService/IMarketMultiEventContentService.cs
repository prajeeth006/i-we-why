using GantryTradingConnector.Shared.Models.MarketModels;
using GantryTradingConnector.Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Services.MarketService
{
    public interface IMarketMultiEventContentService
    {
        Task<IList<RacingEvent>> GetMultiEventMarkets(MultiEventRequest multiEventRequest);

        Task<IList<RacingEvent>> GetMultiEventsForV1(MultiEventRequest multiEventRequest);

        Task<IList<RacingEvent>> GetMultiEventsForV2(MultiEventRequest multiEventRequest);
    }
}
