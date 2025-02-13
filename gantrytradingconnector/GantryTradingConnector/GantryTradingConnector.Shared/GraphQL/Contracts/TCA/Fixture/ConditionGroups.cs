using System.Collections.Generic;
using Bwin.Sports.GraphQL.Client.FieldBuilder.Attributes;
using Newtonsoft.Json;

namespace GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture
{
    public class ConditionGroups
    {
        [GraphQLArguments("field", "ENUM", nameof(MatchParameter.Field))]
        [GraphQLArguments("value", "String", nameof(MatchParameter.Value))]
        [GraphQLArguments("conjunction", "ENUM", nameof(MatchParameter.Conjunction))]
        [JsonProperty(PropertyName = "matchParameters")]
        public IEnumerable<MatchParameter> MatchParameters { get; set; }

        [GraphQLArguments("field", "ENUM", nameof(RangeParameter.Field))]
        [GraphQLArguments("value", "String", nameof(RangeParameter.Start))]
        [GraphQLArguments("conjunction", "ENUM", nameof(RangeParameter.Conjunction))]
        [JsonProperty(PropertyName = "termParameters")]
        public IEnumerable<TermParameter> TermParameters { get; set; }

        [GraphQLArguments("start", "String", nameof(RangeParameter.Start))]
        [GraphQLArguments("end", "String", nameof(RangeParameter.End))]
        [GraphQLArguments("field", "ENUM", nameof(RangeParameter.Field))]
        [GraphQLArguments("conjunction", "ENUM", nameof(RangeParameter.Conjunction))]
        [JsonProperty(PropertyName = "rangeParameters")]
        public IEnumerable<RangeParameter> RangeParameters { get; set; }
    }
}
