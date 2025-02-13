using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Configuration
{
    public interface IRtmsKafkaConsumerConfig
    {
        IDictionary<string, string> ConsumerConfig { get; }
        public string TopicsToConsume { get; }
        public int ConsumeTimeOut { get; }
        public int MaxParallelThreadToConsumeMessages { get; }
        public bool IsConsumerKafkaRtmsPresenceJobEnabled { get; }
        public string ConsumerProtocol { get; }
        public bool IsConsumerKafkaRtmsProcessPresenceEnabled { get; }

    }

    public class RtmsKafkaConsumerConfig : IRtmsKafkaConsumerConfig
    {
        public IDictionary<string, string> ConsumerConfig { get; set; }
        public string TopicsToConsume { get; set; }
        public int ConsumeTimeOut { get; set; }
        public int MaxParallelThreadToConsumeMessages { get; set; }
        public bool IsConsumerKafkaRtmsPresenceJobEnabled { get; set; }
        public string ConsumerProtocol { get; set; }
        public bool IsConsumerKafkaRtmsProcessPresenceEnabled { get; set; }
    }
}
