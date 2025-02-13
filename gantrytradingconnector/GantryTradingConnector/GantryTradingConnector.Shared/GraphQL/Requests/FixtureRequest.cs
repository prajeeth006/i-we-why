using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.GraphQL.Requests
{
    [DataContract]
    public class FixtureRequest : CompetitionRequest
    {
        private new string Includes { get; set; }
        private new string Excludes { get; set; }
        private new bool? IsLive { get; set; }


        [DataMember]
        public int CompetitionId { get; set; }
        [DataMember]
        public string? FixtureType { get; set; }
        [DataMember]
        public bool? IsInPlay { get; set; }
    }

    [DataContract]
    public class FixtureWithoutRegionRequest : CompetitionWithoutRegionRequest
    {
        private new string Includes { get; set; }
        private new string Excludes { get; set; }
        private new bool? IsLive { get; set; }

        [DataMember]
        public int CompetitionId { get; set; }
        [DataMember]
        public string? FixtureType { get; set; }
        [DataMember]
        public bool? IsInPlay { get; set; }
        [DataMember] 
        public string? TradingPartition { get; set; }
    }
}
