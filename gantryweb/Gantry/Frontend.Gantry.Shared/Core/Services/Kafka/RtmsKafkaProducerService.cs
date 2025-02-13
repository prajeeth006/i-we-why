using System;
using System.Globalization;
using System.Threading.Tasks;
using Confluent.Kafka;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Frontend.Gantry.Shared.Core.Services.Kafka.Logging;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Frontend.Gantry.Shared.Core.Services.Kafka
{
    public interface IRtmsKafkaProducerService
    {
        Task ProduceMessageToKafka<T>(T rtmsMessageDetailsMessage) where T: class;
    }

    public class RtmsKafkaProducerService : IRtmsKafkaProducerService
    {
        private readonly IRtmsKafkaProducerConfig _rtmsKafkaProducerConfig;
        private readonly ILogger<RtmsKafkaProducerService> _log;
        private readonly IRtmsKafkaMessageLogging _rtmsKafkaMessageLogging;
        private readonly IProducer<string, string> _producer;
        private readonly IGetKeyRTMSKafka _keyRtmsKafka;
        public RtmsKafkaProducerService(IRtmsKafkaProducerConfig rtmsKafkaProducerConfig, ILogger<RtmsKafkaProducerService> log, IRtmsKafkaMessageLogging rtmsKafkaMessageLogging,
            IGetKeyRTMSKafka keyRtmsKafka)
        {
            _rtmsKafkaProducerConfig = rtmsKafkaProducerConfig;
            _log = log;
            _rtmsKafkaMessageLogging = rtmsKafkaMessageLogging;
            _producer = new ProducerBuilder<string, string>(new ProducerConfig(rtmsKafkaProducerConfig.ProducerConfig))
                .SetErrorHandler(
                    (_, error) =>
                    {
                        _log.LogError($"Not able to produce message to RTMS kafka for reason: {error.Reason}", error);
                    }).Build();
            _keyRtmsKafka = keyRtmsKafka;
        }

        public async Task ProduceMessageToKafka<T>(T rtmsMessageDetailsMessage) where T : class
        {
            try
            {
                string value = JsonConvert.SerializeObject(rtmsMessageDetailsMessage, Formatting.Indented,
                    new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore
                    });
                DateTime startTime = DateTime.UtcNow;
                _log.LogInformation(
                    $"ProduceMessageToKafka Result: started at time {startTime.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}");
                string rtmsMessageKey = _keyRtmsKafka.GetKeyForRTMSMessage(rtmsMessageDetailsMessage);
                DeliveryResult<string, string> result = await _producer.ProduceAsync(
                    _rtmsKafkaProducerConfig.TopicsToPushMessages,
                    new Message<string, string>
                        {Key = !string.IsNullOrEmpty(rtmsMessageKey) ? rtmsMessageKey : null, Value = value});

                if (rtmsMessageDetailsMessage is RtmsMessageDetailsMessage rtmsDetailsMessage)
                {
                    using (_log.BeginScope(_rtmsKafkaMessageLogging.GetCustomLoggingProperties(rtmsDetailsMessage)))
                    {
                        if (result != null)
                            _log.LogInformation(
                                $"ProduceMessageToKafka Result: Status: {result.Status},Key:{result.Key}, Value: {result.Value}, TimeStamp: {result.Timestamp.UtcDateTime.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}, Latency {(result.Timestamp.UtcDateTime - startTime).TotalMilliseconds}");
                    }
                }

                if (rtmsMessageDetailsMessage is RtmsSportsChannelMessageDetails rtmsSportsDetailsMessage)
                {
                    using (_log.BeginScope(
                               _rtmsKafkaMessageLogging.GetCustomLoggingProperties(rtmsSportsDetailsMessage)))
                    {
                        if (result != null)
                            _log.LogInformation(
                                $"ProduceMessageToKafka Result: Status: {result?.Status},Key:{result?.Key}, Value: {result?.Value}, TimeStamp: {result.Timestamp.UtcDateTime.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}, Latency {(result.Timestamp.UtcDateTime - startTime).TotalMilliseconds}");
                    }
                }
            }
            catch (Exception ex)
            {
                _log.LogError($"Unable to ProduceMessageToKafka: {ex.Message} ",ex);
            }
        }

        
    }
}