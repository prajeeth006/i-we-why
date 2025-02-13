using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture;
using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Regions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Competition
{
    public class CompetitionConnection : SearchConnection
    {
        public CompetitionEdge[] Edges { get; set; }
    }
}
