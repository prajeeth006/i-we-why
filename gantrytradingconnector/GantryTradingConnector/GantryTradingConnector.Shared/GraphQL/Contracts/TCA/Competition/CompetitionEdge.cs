using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Regions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Competition
{
    public class CompetitionEdge
    {
        public Competition Node { get; set; }
    }
}
