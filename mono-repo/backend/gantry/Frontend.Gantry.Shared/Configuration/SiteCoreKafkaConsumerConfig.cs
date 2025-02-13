using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Configuration
{
    public interface ISiteCoreKafkaConsumerConfig
    {
        IDictionary<string, string> ConsumerConfig { get; }
        public string TopicsToConsume { get; }
        public int ConsumeTimeOut { get; }
        public int MaxParallelThreadToConsumeMessages { get; }
        public string SiteCoreTemplateConfig { get; }
        public bool IsConsumerKafkaSiteCoreJobEnabled { get; }
        public string ConsumerProtocol { get; }
        public bool IsConsumerKafkaSitecoreMessageProcessEnabled { get; }
    }
    public class SiteCoreKafkaConsumerConfig : ISiteCoreKafkaConsumerConfig
    {
        public IDictionary<string, string> ConsumerConfig { get; set; }
        public string TopicsToConsume { get; set; }
        public int ConsumeTimeOut { get; set; }
        public int MaxParallelThreadToConsumeMessages { get; set; }
        public string SiteCoreTemplateConfig { get; set; }
        public bool IsConsumerKafkaSiteCoreJobEnabled { get; set; }
        public string ConsumerProtocol { get; set; }
        public bool IsConsumerKafkaSitecoreMessageProcessEnabled { get; set; }
    }
}
