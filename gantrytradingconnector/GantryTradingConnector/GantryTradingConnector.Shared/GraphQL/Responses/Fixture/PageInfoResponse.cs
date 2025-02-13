using System.Runtime.Serialization;

namespace GantryTradingConnector.Shared.Contracts.Responses.Fixture
{
    [DataContract]
    public class PageInfoResponse
    {
        [DataMember]
        public string EndCursor { get; set; }

        [DataMember]
        public bool HasNextPage { get; set; }

        [DataMember]
        public bool HasPreviousPage { get; set; }

        [DataMember]
        public string StartCursor { get; set; }
    }
}
