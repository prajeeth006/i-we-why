using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Models.MarketModels
{
    public class MarketRequest
    {
        public string FixtureId { get; set; }
        public string Version { get; set; }
        public bool IsBCPApiEnabled { get; set; }
        public IList<TradingTemplate> TradingTemplates { get; set; }
        public string? language { get; set; }
        public bool? skipMarketFilter { get; set; }
        public bool isGolfOutrightMarket { get; set; }
    }

}
