using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Configuration
{
    public interface IRtmsKafkaProducerConfig
    {
        IDictionary<string, string> ProducerConfig { get; }
        public string TopicsToPushMessages { get; }
    }

    public class RtmsKafkaProducerConfig : IRtmsKafkaProducerConfig
    {
        public IDictionary<string, string> ProducerConfig { get; set; }
        public string TopicsToPushMessages { get; set; }
    }
}