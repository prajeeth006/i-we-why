using Microsoft.Extensions.Logging;

namespace Frontend.Gantry.Shared.Models
{
    public class Log
    {
        public string Message { get; set; } = null!;
        public LogLevel Level { get; set; }
        public string Status { get; set; }
        //Fatal property(true) will tell SOC that something goes really wrong and team need to check and find that out!
        public bool Fatal { get; set; }
        public string ShopId { get; set; }
        public string ScreenId { get; set; }
        public string Stack { get; set; }
        public string TraceId { get; set; }
        public string TimeStampFromFrontendInBtc { get; set; }
    }
}