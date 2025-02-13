using Newtonsoft.Json;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    public class PreviewAssetDetails
    {
        [JsonProperty("event")]
        public Event racingEvent { get; set; }
        public string id { get; set; }
        public bool isPromotionTreeNode { get; set; }
        public bool isCarousleNode { get; set; }
        public bool isMultiEventTreeNode { get; set; }
        public bool isMisc { get; set; }
        public string targetLink { get; set; }

        public string contentItemId { get; set; }
        public bool isManualTreeNode { get; set; }
        public string targetId { get; set; }

    }

    public class Event
    {
        public int typeId { get; set; }
        public string typeName { get; set; }

        public List<Market>? markets { get; set; }
        public int? TradingPartitionId { get; set; }

        [JsonProperty("virtual")]
        public bool Virtual { get; set; }
        public string targetLink { get; set; }
        public string assetType { get; set; }
        public SplitScreen? splitScreen { get; set; }
    }
}
