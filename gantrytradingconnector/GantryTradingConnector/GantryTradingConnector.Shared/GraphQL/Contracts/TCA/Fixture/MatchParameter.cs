using Newtonsoft.Json;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture
{
    public class MatchParameter : BaseParameter
    {
        [JsonProperty(PropertyName = "value")]
        public string Value { get; set; }
    }
}
