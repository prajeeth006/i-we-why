using Newtonsoft.Json;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture
{
    public class SortParameter
    {
        [JsonProperty(PropertyName = "sort")]
        public string Sort { get; set; }

        [JsonProperty(PropertyName = "field")]
        public string Field { get; set; }
    }
}
