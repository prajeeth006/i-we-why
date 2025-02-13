using Bwin.Vanilla.Content.Model;

namespace Frontend.Gantry.Shared.Models
{
    public class StaticPromotion
    {
        public ContentImage BackgroundImage { get; set; }
        public ContentImage ForegroundImage { get; set; }
        public string Description { get; set; }
        public string Title { get; set; }
    }
}