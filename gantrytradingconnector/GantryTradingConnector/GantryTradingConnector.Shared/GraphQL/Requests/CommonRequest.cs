using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.GraphQL.Requests
{
    [DataContract]
    public class CommonRequest
    {

        [DataMember]
        public int? LabelId { get; set; }

        [DataMember]
        public DateTime? StartDate { get; set; }

        [DataMember]
        public DateTime? EndDate { get; set; }

        [DataMember] public int? First { get; set; } = 10000;

        [DataMember]
        public string? Includes { get; set; }

        [DataMember]
        public string? Excludes { get; set; }

        [DataMember]
        public SortTypes? SortType { get; set; }

        [DataMember]
        public string? SortField { get; set; }
    }

}
