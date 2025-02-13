using Frontend.Vanilla.Content.Model;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    public class GreyHoundRacingContentDetails
    {
        public ContentImage? RacingPostImage { get; set; }
        public ContentImage? RacingPostImageFull { get; set; }
        public ContentParameters ContentParameters { get; set; } = null!;
        public ContentImage? GreyHoundRacingImage { get; set; }
        public ContentImage? RacingVirtualImage { get; set; }
        public ContentImage? GreyHoundRacingPostPic { get; set; }
    }
}
