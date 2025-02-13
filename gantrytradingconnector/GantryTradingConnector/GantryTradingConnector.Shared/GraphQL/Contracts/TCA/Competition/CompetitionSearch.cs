using Bwin.Sports.GraphQL.Client.FieldBuilder.Attributes;
using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture;
using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Regions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Competition
{
    public class CompetitionSearch : SearchConditionAndSort
    {
        [GraphQLArguments("first", "Int", "first")]

        public CompetitionConnection Competitions { get; set; }
    }
}
