using System.Runtime.Serialization;

namespace GantryTradingConnector.Shared.GraphQL.Requests
{
    [DataContract]
    public class TermRequest : BaseParameterRequest
    {
        [DataMember]
        public string Value { get; set; }
    }
}
