using System;
using System.Linq;
using Frontend.Gantry.Shared.Core.Common.Constants;

namespace Frontend.Gantry.Shared.Core.Models.Services.Kafka
{
    public class SportsChannelMessage
    {
        public string type { get; set; } = "TV_CTRL";

        public SportsChannelPayload payload { get; set; }
    }

    public class SportsChannelPayload
    {
        public string traceID { get; set; } = GetRandomTraceId();

        public Decoder[] decoderGroups { get; set; }

        private static string GetRandomTraceId()
        {
            Random random = new Random();
            return new string(Enumerable.Repeat(ConstantsPropertyValues.TraceIdCharacters, 14)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}