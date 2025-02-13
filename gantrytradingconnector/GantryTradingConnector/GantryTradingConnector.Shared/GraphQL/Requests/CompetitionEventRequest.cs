using System.Runtime.Serialization;

namespace GantryTradingConnector.Shared.GraphQL.Requests
{
    [DataContract]
    public class CompetitionEventRequest
    {
        [DataMember]
        public SearchField? Filter { get; set; }

        [DataMember]
        public SortRequest Sort { get; set; }

        [DataMember]
        public TermRequest[] Terms { get; set; }

        [DataMember]
        public RangeRequest[] Ranges { get; set; }

        [DataMember]
        public SearchRestriction Restriction { get; set; } = SearchRestriction.None;
    }
}
