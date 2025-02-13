using Bwin.Sports.GraphQL.Client.FieldBuilder.Attributes;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture
{
    public class SearchConnection
    {

        [GraphQLFieldIgnore]
        public string After { get; set; }

        public PageInfo PageInfo { get; set; }

        public int TotalCount { get; set; }
    }
}
