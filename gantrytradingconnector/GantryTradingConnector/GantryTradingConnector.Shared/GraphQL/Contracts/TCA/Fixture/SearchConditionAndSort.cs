using Bwin.Sports.GraphQL.Client.FieldBuilder.Attributes;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture
{
    public class SearchConditionAndSort
    {
        [GraphQLFieldIgnore]
        public ConditionGroups Conditions { get; set; }

        [GraphQLFieldIgnore]
        [GraphQLArguments("sort", "ENUM", nameof(SortParameter.Sort))]
        [GraphQLArguments("field", "ENUM", nameof(SortParameter.Field))]
        public SortParameter Sort { get; set; }
    }
}
