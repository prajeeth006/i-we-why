using System.Runtime.Serialization;

namespace GantryTradingConnector.Shared.GraphQL.Requests
{
    [DataContract]
    public class RangeRequest : BaseParameterRequest
    {
        [DataMember]
        public string Start { get; set; }

        [DataMember]
        public string End { get; set; }
    }
}
