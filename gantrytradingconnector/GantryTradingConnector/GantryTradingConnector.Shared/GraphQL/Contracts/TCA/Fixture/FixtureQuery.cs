using Bwin.Sports.GraphQL.Client.FieldBuilder.Attributes;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture
{
    public class FixtureQuery
    {
        [GraphQLArguments("conditions", "ConditionGroupInputType!", nameof(ConditionGroups))]
        [GraphQLArguments("sort", "SortInputType!", nameof(SortParameter))]
        public FixtureSearch FixtureSearch { get; set; }
    }
}
