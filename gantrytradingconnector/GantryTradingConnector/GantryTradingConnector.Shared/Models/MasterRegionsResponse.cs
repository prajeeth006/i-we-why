using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Models
{
    public class MasterRegionResponse: BaseResponse
    {
        public List<MasterRegion> MasterRegions { get; set; }
        public List<RegionsWhichAreExcluded> lstRegionsWhichAreExcluded { get; set; }
    }
    
    public class MasterRegion
    {
        public string Id { get; set; }
        public int InternalId { get; set; }
        public string Code { get; set; }
        public RegionName Name { get; set; }
        public List<string> UsedInTradingPartition { get; set; }
        public bool isCompetitionsAvailableInAdvance { get; set; }

        public RegionsWhichAreExcluded regionsWhichAreExcluded { get; set; } = new();
    }

    public class RegionName
    {
        public string StringId { get; set; }
        public string Language { get; set; }
        public string Value { get; set; }
    }

    public class RegionsWhichAreExcluded
    {
        public string regionId { get; set; }
        public string regionName { get; set;}
    }
}
