using Bwin.Sports.GraphQL.Client.FieldBuilder.Attributes;
using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Regions
{
    public class RegionQuery
    {
        [GraphQLArguments("conditions", "ConditionGroupInputType!", nameof(ConditionGroups))]
        [GraphQLArguments("sort", "SortInputType!", nameof(SortParameter))]
        public RegionSearch RegionTreeSearch { get; set; }
    }
}
