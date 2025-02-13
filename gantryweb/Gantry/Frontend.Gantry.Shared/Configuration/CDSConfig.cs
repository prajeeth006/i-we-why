namespace Frontend.Gantry.Shared.Configuration
{
    public interface ICDSConfig
    {
        public string? FixtureViewUrl { get; }
        public string? FixturesUrl { get; }
        public string? AccessId { get; }
        public string? Lang { get; }
        public string? Country { get; }
        public int? CdsRetryDelay { get; }

    }
    public class CDSConfig : ICDSConfig
    {
        public string? FixtureViewUrl { get; set; }
        public string? FixturesUrl { get; set; }
        public string? AccessId { get; set; }
        public string? Lang { get; set; }
        public string? Country { get; set; }

        public int? CdsRetryDelay { get; set; }
    }
}
