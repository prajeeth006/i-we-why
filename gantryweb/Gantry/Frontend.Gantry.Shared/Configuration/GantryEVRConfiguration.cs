namespace Frontend.Gantry.Shared.Configuration
{
    public interface IGantryEvrConfiguration
    {
        public int evrOffPageDelayTime { get; }
        public string evrTypeIds { get; }
    }

    public class GantryEvrConfiguration : IGantryEvrConfiguration
    {
        public int evrOffPageDelayTime { get; set; }
        public string evrTypeIds { get; set; }
    }
}