using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Models.MarketModels
{
    public class MarketResponse : BaseResponse
    {
        public List<TradingTemplateMarkets>? TradingTemplates { get; set; }
    }
}
