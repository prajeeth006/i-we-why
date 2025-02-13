using Bwin.Sports.GraphQL.Client.FieldBuilder.Attributes;
using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture;
using Newtonsoft.Json;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Regions
{
    public class RegionSearch : SearchConditionAndSort
    {
        [GraphQLArguments("first", "Int", "first")]

        public RegionConnection Regions { get; set; }
    }
}
