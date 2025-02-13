using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.GraphQL.Config
{
    public class DurationConfiguration
    {
        public int NumberOfDays { get; set; }
        public double CacheTimeOutInMinutes { get; set; }
    }
}
