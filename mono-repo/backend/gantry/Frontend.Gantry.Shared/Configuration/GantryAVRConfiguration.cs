namespace Frontend.Gantry.Shared.Configuration
{
    public interface IGantryAvrConfiguration
    {
        public string avrTypeIds { get; }
    }

    public class GantryAvrConfiguration : IGantryAvrConfiguration
    {
        public string avrTypeIds { get; set; }
    }
}