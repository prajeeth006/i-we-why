using Bwin.Vanilla.Content.Model;

namespace Frontend.Gantry.Shared.Core.Models.Services.SiteCore
{
    public class GreyHoundRacingContentDetails
    {
        public ContentImage? RacingPostImage { get; set; }
        public ContentImage? RacingPostImageFull { get; set; }
        public ContentParameters ContentParameters { get; set; } = null!;

        public GreyHoundImages GreyHoundImages { get; set; } = null!;


    }
}