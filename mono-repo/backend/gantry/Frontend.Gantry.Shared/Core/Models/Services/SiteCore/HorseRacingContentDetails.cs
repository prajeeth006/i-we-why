using Frontend.Vanilla.Content.Model;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    public class HorseRacingContentDetails
    {
        public ContentImage? RacingPostImage { get; set; }
        public ContentParameters ContentParameters { get; set; } = null!;        
        public ContentImage? DarkThemeRacingPostImage { get; set; }
        public ContentImage? HorseRacingImage { get; set; }
        public ContentImage? RacingVirtualImage { get; set; }
        public ContentImage? FallbackImage { get; set; }
        public ContentImage? MoneyBoostImage { get; set; }
        public ContentImage? EpsFooterLogoNewDesign { get; set; }
        public ContentImage? ScrollingRacingPostTip { get; set; }

    }
}
