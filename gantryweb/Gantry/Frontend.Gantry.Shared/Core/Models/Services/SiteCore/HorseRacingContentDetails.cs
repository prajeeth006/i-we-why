using Bwin.Vanilla.Content.Model;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    public class HorseRacingContentDetails
    {
        public ContentImage? RacingPostImage { get; set; }
        public ContentParameters ContentParameters { get; set; } = null!;
        public ContentParameters racingImages { get; set; } = null!;
    }
}