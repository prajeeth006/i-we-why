using System.Runtime.Serialization;
using GantryTradingConnector.Shared.Models;

namespace GantryTradingConnector.Shared.Contracts.Responses.Fixture
{
    
    public class RegionInfoResponse : BaseResponse
    {
        public RegionInfo Regions { get; set; }
        public RegionInfo ExcludedRegions { get; set; }

        public RegionInfoResponse()
        {
            Regions = new RegionInfo();
        }

    }

    [DataContract]
    public class RegionInfo
    {
        [DataMember]
        public List<RegionResponse> Regions { get; set; }

        [DataMember]
        public PageInfoResponse PageInfo { get; set; }

        [DataMember]
        public int TotalCount { get; set; }

    }
}
