namespace GantryTradingConnector.Shared.Models
{
    public class LogResponse
    {
        public string? RequestUri  { get; set; }

        public HttpResponseMessage? Response { get; set;}

        public long? Latency { get; set; }
    }
}
