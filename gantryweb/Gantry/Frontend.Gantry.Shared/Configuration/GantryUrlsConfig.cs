namespace Frontend.Gantry.Shared.Configuration
{
    public interface IGantryUrlsConfig
    {
        public string StaticPromotionsUrlItemPath { get; }
        public string MultiviewUrlItemPath { get;  }
        public string CarouselUrlItemPath { get; }
    }

    public class GantryUrlsConfig : IGantryUrlsConfig
    {
        public string StaticPromotionsUrlItemPath { get; set; }
        public string MultiviewUrlItemPath { get; set; }
        public string CarouselUrlItemPath { get; set; }
    }
}