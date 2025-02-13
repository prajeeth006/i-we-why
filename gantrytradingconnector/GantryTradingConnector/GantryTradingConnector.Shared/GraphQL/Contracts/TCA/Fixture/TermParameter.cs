using Newtonsoft.Json;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture
{
    public class TermParameter : BaseParameter
    {
        [JsonProperty(PropertyName = "value")]
        public string Value { get; set; }
    }
}
