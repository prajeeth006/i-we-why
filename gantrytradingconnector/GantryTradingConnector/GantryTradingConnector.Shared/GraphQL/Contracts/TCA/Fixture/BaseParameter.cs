using Newtonsoft.Json;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture
{
    public abstract class BaseParameter
    {
        [JsonProperty(PropertyName = "field")]
        public string Field { get; set; }

        [JsonProperty(PropertyName = "conjunction")]
        public string Conjunction { get; set; }
    }
}
