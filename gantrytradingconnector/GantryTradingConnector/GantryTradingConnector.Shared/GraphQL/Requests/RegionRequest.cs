using System.Runtime.Serialization;

namespace GantryTradingConnector.Shared.GraphQL.Requests
{
    [DataContract]
    public class RegionRequest : CommonRequest
    {
        [DataMember]
        public int SportId { get; set; }

    }

    [DataContract]
    public class WithoutRegionRequest : CommonRequest
    {
        [DataMember]
        public int SportId { get; set; }

    }
}
