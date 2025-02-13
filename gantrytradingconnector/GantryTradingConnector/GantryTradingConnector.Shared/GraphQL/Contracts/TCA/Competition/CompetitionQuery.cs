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
    public class CompetitionQuery
    {
        [GraphQLArguments("conditions", "ConditionGroupInputType!", nameof(ConditionGroups))]
        [GraphQLArguments("sort", "SortInputType!", nameof(SortParameter))]
        public CompetitionSearch CompetitionTreeSearch { get; set; }
    }
}
