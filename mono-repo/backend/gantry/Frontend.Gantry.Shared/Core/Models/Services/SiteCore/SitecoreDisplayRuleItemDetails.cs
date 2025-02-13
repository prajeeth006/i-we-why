using System;
using System.Collections.Generic;
using Frontend.Gantry.Shared.Core.BusinessLogic.JsonConverters;
using Newtonsoft.Json;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    [Serializable]
    [JsonConverter(typeof(SiteCoreDisplayRuleItemConverter))]
    public class SiteCoreDisplayRuleItemDetails : ICloneable
    {
        public string? DisplayRuleItemId { get; set; }
        public string? TargetItemId { get; set; }
        public string? TargetItemPath { get; set; }
        public string? ShopId { get; set; }
        public int? ScreenInShop { get; set; }
        public string? Location { get; set; }
        public string? DeviceId { get; set; }
        public string? Brand { get; set; }
        public string? TemplateName { get; set; }
        public string[] GroupsNames { get; set; } = null!;
        public DateTime? Updated { get; set; }
        public string? TypeName { get; set; }
        public string? CategoryCode { get; set; }
        public string? ClassName { get; set; }
        public string? EventId { get; set; }
        public List<Market>? MarketIds { get; set; }
        public string? TypeId { get; set; }
        public bool IsStaticPromotion { get; set; }
        public bool IsMultiView { get; set; }
        public bool IsSportsChannel { get; set; }
        public bool IsCarousel { get; set; }
        public int? DisplayOrder { get; set; }
        public int? CarouselDuration { get; set; }
        public string? DecoderID { get; set; }
        public string? EventMarketPairs { get; set; }
        public string? TypeIds { get; set; }
        public string? contentItemId { get; set; }
        public bool IsQuadUpdated { get; set; }
        public bool IsMultiEvent { get; set; }

        public string GantryType { get; set; }
        public int? ViewId { get; set; } = null;
        public string ViewGroup { get; set; }
        public string ScreenType { get; set; }

        public List<GantryScreens>? GantryScreens { get; set; }
        public bool isMisc { get; set; }
        public bool IsManualCreateTemplate { get; set; }
        public bool isManualTreeNode { get; set; }
        public string? ContentMediaType { get; set; }
        public int? TradingPartitionId { get; set; }
        public string? RacingAssetType { get; set; }
        public SplitScreen? SplitScreen { get; set; }
        public string? ContentProvider { get; set; }

        public object Clone()
        {
            return this.MemberwiseClone();
        }
    }

    [Serializable]
    public class Market
    {
        public int id { get; set; }
        public string name { get; set; }
    }


    [Serializable]
    public class GantryScreens
    {
        public string screenTypeId { get; set; }
        public int? screenId { get; set; }
        public int? viewId { get; set; } = null;
        public string viewGroup { get; set; }
        public string screenType { get; set; }
    }
}
