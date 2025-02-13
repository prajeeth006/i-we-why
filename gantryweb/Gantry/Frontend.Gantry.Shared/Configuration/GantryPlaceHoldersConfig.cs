namespace Frontend.Gantry.Shared.Configuration
{
    public interface IGantryPlaceHoldersConfig
    {
       public  string PlaceHolders { get; }
    }
    public class GantryPlaceHoldersConfig : IGantryPlaceHoldersConfig
    {
        public string PlaceHolders { get; set; }
    }
}