using System.Runtime.Serialization;

namespace GantryTradingConnector.Shared.GraphQL.Requests
{
    [DataContract]
    public class SortRequest
    {
        [DataMember]
        public SortTypes SortType { get; set; }

        [DataMember]
        public string Field { get; set; }
    }
}
