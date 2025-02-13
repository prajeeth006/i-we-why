namespace Frontend.Gantry.Shared.Configuration
{
    public interface IGantryErrorPageConfiguration
    {
        bool ShowDataFeedApiUrl { get; }
        public string BrandImagePathInElectron { get; }
    }
    public class GantryErrorPageConfiguration : IGantryErrorPageConfiguration
    {
        public bool ShowDataFeedApiUrl { get; set; }
        public string BrandImagePathInElectron { get; set; }       
    }
}
