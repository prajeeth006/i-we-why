using Newtonsoft.Json;
using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    public class PreviewAssetDetails
    {
        [JsonProperty("event")]
        public Event racingEvent { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public int level { get; set; }
        public bool isFolder { get; set; }
        public bool expandable { get; set; }
        public bool isPromotionTreeNode { get; set; }
        public bool isRacingTreeNode { get; set; }
        public bool isSportsTreeNode { get; set; }
        public bool isLoading { get; set; }
        public string nodeId { get; set; }
        public bool isChannelTreeNode { get; set; }
        public bool isNrmChannelTreeNode { get; set; }
        public bool isCarousleNode { get; set; }

        public bool isSkyChannelTreeNode { get; set; }
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
        public string categoryCode { get; set; }
        public string className { get; set; }
        public string marketsWhichAreDropped { get; set; }

        public List<Market>? markets { get; set; }
        public bool isStandardTemplatesLoaded { get; set; }
        public bool isExpandable { get; set; } = true;

        [JsonProperty("virtual")]
        public bool Virtual { get; set; }
        public string eventName { get; set; }

        public string tabName { get; set; } //for now it is only applicable for SportsTab
        public string targetLink { get; set; }
        public bool isMeetingPages { get; set; }
        public string meetingPageRelativePath { get; set; }

        public string eventSortCode { get; set; }
    }
}