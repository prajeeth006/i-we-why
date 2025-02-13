using GantryTradingConnector.Shared.Models.MarketModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Services.MarketService
{
    public interface IMarketContentService
    {
        Task<MarketResponse> GetMarkets(MarketRequest marketRequest);
    }
}
