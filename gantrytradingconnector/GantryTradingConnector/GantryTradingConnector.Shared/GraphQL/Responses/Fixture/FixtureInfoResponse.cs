using System.Runtime.Serialization;
using GantryTradingConnector.Shared.Models;

namespace GantryTradingConnector.Shared.Contracts.Responses.Fixture
{
    
    public class FixtureInfoResponse:BaseResponse
    {
        public FixtureInfo FixtureInfo { get; set; }
      
    }

    [DataContract]
    public class FixtureInfo
    {
        [DataMember]
        public FixtureResponse[] Fixtures { get; set; }

        [DataMember]
        public PageInfoResponse PageInfo { get; set; }

        [DataMember]
        public int TotalCount { get; set; }

    }

    public class FixtureInfoWithoutRegionResponse : BaseResponse
    {
        public FixtureInfoWithoutRegion FixtureInfo { get; set; }

    }

    [DataContract]
    public class FixtureInfoWithoutRegion
    {
        [DataMember]
        public FixtureWithoutRegionResponse[] Fixtures { get; set; }

        [DataMember]
        public PageInfoResponse PageInfo { get; set; }

        [DataMember]
        public int TotalCount { get; set; }

    }
}
