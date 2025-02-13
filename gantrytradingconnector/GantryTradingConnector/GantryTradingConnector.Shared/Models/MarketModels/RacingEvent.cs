using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Models.MarketModels
{
    public class RacingEvent
    {
        public int FixtureId { get; set; }

        public string Name { get; set; }

        public string StartDate { get; set; }

        public IList<RacingMarket> Markets { get; set; }
    }
}
