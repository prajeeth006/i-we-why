using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    public class ScreenWithLatestRule
    {
        public string GantryType { get; set; }
        public int? ScreenInShop { get; set; }
        public string ViewGroup { get; set; }
        public string ScreenType { get; set; }
        public int? ViewId { get; set; }
        public DroppedItem? Asset { get; set; }

    }


    public class DroppedItem
    {
        public string id { get; set; }
        public string ruleId { get; set; }
        public string targetItemId { get; set; }
        public string name { get; set; }
        public bool isPromotionTreeNode { get; set; }
        public bool isRacingTreeNode { get; set; }
        public bool isChannelTreeNode { get; set; }
        public bool isSkyChannelTreeNode { get; set; }
        public bool isMultiEventTreeNode { get; set; }
        public bool isCarousleNode { get; set; }
        public bool isMultiView { get; set; }
        public int displayOrder { get; set; }
        public string eventMarketPairs { get; set; }
        public string typeIds { get; set; }
        public string assetType { get; set; }

        public RacingEventData Event { get; set; }
        public bool isMisc { get; set; }      
        public bool IsManualCreateTemplate { get; set; }
        public string? contentItemId { get; set; }
        public bool isManualTreeNode { get; set; }
        public string ContentMediaType { get; set; }
        public string ContentProvider { get; set; }

    }

    public class RacingEventData : RacingData
    {
        public int typeId { get; set; }
        public string typeName { get; set; }
        public string categoryCode { get; set; }
        public string className { get; set; }
        public string marketsWhichAreDropped { get; set; }

        public IEnumerable<RacingMarket> markets { get; set; }
        public bool isStandardTemplatesLoaded { get; set; }
        public bool isExpandable { get; set; } = true;

        [JsonProperty("virtual")] public bool Virtual { get; set; }

        public string tabName { get; set; } //for now it is only applicable for SportsTab
        public string targetLink { get; set; }
        public bool isMeetingPages { get; set; }
        public string meetingPageRelativePath { get; set; }

        public string eventSortCode { get; set; }
        public string ContentMediaType { get; set; }
        public string racingAssetType { get; set; }
        public SplitScreen? splitScreen { get; set; }
        public int? tradingPartitionId { get; set; }
        public string ContentProvider { get; set; }
    }

    public class RacingData
    {
        public int id { get; set; }
        public string name { get; set; }
        public string startTime { get; set; }
        public string eventName { get; set; }
    }

    public class RacingMarket : RacingData
    {
    }
    public class SplitScreen
    {
        public int? splitScreenStartRange { get; set; }
        public int? splitScreenEndRange { get; set; }
        public int? splitScreenPageNo { get; set; }
        public int? splitScreenTotalPages { get; set; }
        public string? displayAssetNameOnScreenWhenDragged { get; set; }
        public int? maxRunnerCount { get; set; }

    }
}
