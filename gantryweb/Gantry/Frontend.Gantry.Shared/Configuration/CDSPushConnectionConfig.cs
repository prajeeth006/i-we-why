namespace Frontend.Gantry.Shared.Configuration
{
    public interface ICDSPushConnectionConfig
    {
        public string? PushAccessId { get; }
        public string? PushUrl { get; }
        public int? MaxRetries { get; }
        public int? PrefferedTransportType { get; }
        public bool? SkipNegotiation { get; }
        public string? Lang { get; }
        public string? UserCountry { get; }
        public bool? IsMainToLiveTransitionEnabled { get; }
        public int? PushCdsRetryDelay { get; }

    }
    public class CDSPushConnectionConfig : ICDSPushConnectionConfig
    {
        public string? PushAccessId { get; set; }
        public string? PushUrl { get; set; }
        public int? MaxRetries { get; set; }
        public int? PrefferedTransportType { get; set; }
        public bool? SkipNegotiation { get; set; }
        public string? Lang { get; set; }
        public string? UserCountry { get; set; }
        public bool? IsMainToLiveTransitionEnabled { get; set; }
        public int? PushCdsRetryDelay { get; set; }
    }
}