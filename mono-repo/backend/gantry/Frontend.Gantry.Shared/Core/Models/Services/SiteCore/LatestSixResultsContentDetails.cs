using Frontend.Vanilla.Content.Model;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    public class LatestSixResultsContentDetails
    {
        public ContentImage? RacingPostImage { get; set; }
        public ContentParameters ContentParameters { get; set; } = null!;
        public ContentImage? DarkThemeLatestResultImage { get; set; }
    }
}