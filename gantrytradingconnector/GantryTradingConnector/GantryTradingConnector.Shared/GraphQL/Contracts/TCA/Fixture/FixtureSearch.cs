using Bwin.Sports.GraphQL.Client.FieldBuilder.Attributes;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture
{
    public class FixtureSearch : SearchConditionAndSort
    {
        [GraphQLArguments("first", "Int", "first")]
        public FixtureConnection Fixtures { get; set; }
    }
}
