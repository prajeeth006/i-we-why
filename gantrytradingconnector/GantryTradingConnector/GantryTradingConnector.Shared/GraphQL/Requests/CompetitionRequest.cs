using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.GraphQL.Requests
{

    [DataContract]
    public class CompetitionRequest : RegionRequest
    {
        [DataMember]
        public int RegionId { get; set; }

        [DataMember] public bool? IsLive { get; set; }

    }

    [DataContract]
    public class CompetitionWithoutRegionRequest : WithoutRegionRequest
    {
        [DataMember] public string? TradingPartition { get; set; }
        [DataMember] public bool? IsLive { get; set; }

    }
}
