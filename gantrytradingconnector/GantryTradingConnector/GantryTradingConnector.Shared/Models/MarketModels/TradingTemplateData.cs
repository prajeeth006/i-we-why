using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Models.MarketModels
{
    public class TradingTemplate
    {
        public Guid Id { get; set; }
        public string TemplateIds { get; set; }

        public string MarketNames { get; set; }
    }

    public class TradingTemplateMarkets : BaseResponse
    {
        public Guid Id { get; set; }
        public string TemplateIds { get; set; }

        public string MarketNames { get; set; }
        public IList<RacingMarket> RacingMarkets { get; set; }

        public TradingTemplateMarkets(TradingTemplate tradingTemplate)
        {
            Id = tradingTemplate.Id;
            TemplateIds = tradingTemplate.TemplateIds;
            MarketNames = tradingTemplate.MarketNames;
            RacingMarkets = new List<RacingMarket>();
        }
    }
}
