using Newtonsoft.Json;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture
{
    public class RangeParameter : BaseParameter
    {
        [JsonProperty(PropertyName = "start")]
        public string Start { get; set; }

        [JsonProperty(PropertyName = "end")]
        public string End { get; set; }
    }
}
