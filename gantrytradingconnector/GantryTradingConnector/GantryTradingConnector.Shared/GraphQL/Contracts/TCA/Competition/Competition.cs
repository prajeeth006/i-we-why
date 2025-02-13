using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Competition
{
    public class Competition
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public bool IsLive { get; set; }
    }
}
