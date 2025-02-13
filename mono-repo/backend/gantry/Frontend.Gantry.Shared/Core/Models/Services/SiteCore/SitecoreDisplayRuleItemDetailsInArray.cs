using System;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    public class SiteCoreDisplayRuleItemDetailsInArray
    {
        public string?[]? TargetItemId { get; set; }
        public string?[]? TargetItemPath { get; set; }
        public string?[]? Shop { get; set; }
        public string?[]? ScreenInShop { get; set; }
        public string?[]? ShopLocation { get; set; }
        public string?[]? DeviceId { get; set; }
        public string?[]? BrandName { get; set; }
        public string?[] TemplateName { get; set; } = null!;
        public string[]? ScreenGroup { get; set; } 
        public DateTime[]? Updated { get; set; }
        public string?[] CategoryCode { get; set; }
        public string?[] ClassName { get; set; }
        public string?[] EventId { get; set; }
        public string?[] MarketIds { get; set; }
        public string?[] TypeName { get; set; }
        public string?[] TypeId { get; set; }
        public string?[] IsStaticPromotion { get; set; }
        public string?[] IsMultiView { get; set; }
        public string?[] IsCarousel { get; set; }
        public string?[] IsQuadUpdated { get; set; }
        public string?[] CarouselDuration { get; set; }
        public string?[] DisplayOrder { get; set; }
        public string?[] IsSportsChannel { get; set; }
        public string?[] decoderID { get; set; }
        public string?[] eventMarketPairs { get; set; }
        public string?[] typeIds { get; set; }
        public string?[] GantryScreens { get; set; }
        public string?[] IsManualCreateTemplate { get; set; }
        public string?[] contentItemId { get; set; }
        public string?[] ContentMediaType { get; set; }
        public int?[] TradingPartitionId { get; set; }
        public string?[] RacingAssetType { get; set; }
        public string?[] SplitScreen { get; set; }
        public string?[] ContentProvider { get; set; }
    }
}
