using System;

namespace Frontend.Gantry.Shared.Core.Models.Services.Kafka
{
    public class BaseRtmsMessageDetails
    {
        public string eid { get; set; }
        public long time { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        public string source { get; set; } = "GantryWeb";
        public bool ack { get; set; } = false;
        public Target target { get; set; }
    }
}