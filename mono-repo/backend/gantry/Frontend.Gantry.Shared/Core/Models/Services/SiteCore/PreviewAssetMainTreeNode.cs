using Newtonsoft.Json;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    public class PreviewAssetMainTreeNode
    {
        [JsonProperty("event")]
        public MainTreeNodeEvent racingEvent { get; set; }

        public NodeProperties? nodeProperties { get; set; }
        public NodeOptions? nodeOptions { get; set; }
    }

    public class NodeProperties
    {
        public string id { get; set; }
        public string name { get; set; }

        public bool isPromotionTreeNode { get; set; }
        public bool isCarousleNode { get; set; }
        public bool isMultiEventTreeNode { get; set; }
        public bool isMisc { get; set; }
        public string targetLink { get; set; }

        public string contentItemId { get; set; }
        public bool isManualTreeNode { get; set; }
        public string targetId { get; set; }
    }

    public class NodeOptions
    {
      
    }

    public class MainTreeNodeEvent
    {
        public int typeId { get; set; }
        public string typeName { get; set; }

        public List<Market>? markets { get; set; }
        public int? TradingPartitionId { get; set; }

        [JsonProperty("virtual")] public bool Virtual { get; set; }
        public string targetLink { get; set; }

    }
}
