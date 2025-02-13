
using GantryTradingConnector.Shared.GraphQL.Contracts.TCA.Fixture;
using System.Runtime.Serialization;

namespace GantryTradingConnector.Shared.GraphQL.Requests
{
    [DataContract]
    public abstract class BaseParameterRequest
    {
        [DataMember]
        public string Field { get; set; }

        [DataMember]
        public Conjunction ConjunctionType { get; set; }
    }
}
