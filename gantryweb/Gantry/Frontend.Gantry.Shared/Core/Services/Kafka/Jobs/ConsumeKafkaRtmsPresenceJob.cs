using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Globalization;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Bwin.Vanilla.Core.System.Uris;
using Confluent.Kafka;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.BackgroundJob;
using Frontend.Gantry.Shared.Core.BusinessLogic;
using Frontend.Gantry.Shared.Core.Common;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Frontend.Gantry.Shared.Core.Services.Kafka.Jobs
{
    public class ConsumeKafkaRtmsPresenceJob : BaseJob
    {
        private readonly IRtmsKafkaConsumerConfig _rtmsKafkaConsumerConfig;
        private bool _shouldKeepRunning = true;
        private IDictionary<string, string> _kafkaConfig;
        private string[] _topics;
        private int _consumeTimeOut;
        private int _maxParallelThreadToConsumeMessages;
        private readonly IBrandUrl _brandUrl;
        private readonly IGantryBrandUrlMapping _gantryBrandUrlMapping;
        private IDictionary<string, string> _brandUrlMapper = new ConcurrentDictionary<string, string>();
        private readonly IConfiguration _configuration;
        private IConfiguration _config;

        public ConsumeKafkaRtmsPresenceJob(
            ILogger<ConsumeKafkaRtmsPresenceJob> log,
            IRtmsKafkaConsumerConfig rtmsKafkaConsumerConfig, IBrandUrl brandUrl, IGantryBrandUrlMapping gantryBrandUrlMapping, IConfiguration configuration) 
            : base(log)
        {
            _rtmsKafkaConsumerConfig = rtmsKafkaConsumerConfig;
            _brandUrl = brandUrl;
            _gantryBrandUrlMapping = gantryBrandUrlMapping;
            _configuration = configuration;
        }

        protected override void DoPreWorkBeforeOwnThreadStarts()
        {
            _kafkaConfig = _rtmsKafkaConsumerConfig.ConsumerConfig;
            _topics = _rtmsKafkaConsumerConfig.TopicsToConsume.Split(',');
            _consumeTimeOut = _rtmsKafkaConsumerConfig.ConsumeTimeOut;
            _brandUrlMapper = _gantryBrandUrlMapping.BrandUrlMapper;
            _maxParallelThreadToConsumeMessages = _rtmsKafkaConsumerConfig.MaxParallelThreadToConsumeMessages == 0 ? 25 : _rtmsKafkaConsumerConfig.MaxParallelThreadToConsumeMessages;
            _config = _configuration;
        }

        protected override async Task DoWorkInOwnThread()
        {
            Log.LogInformation("RtmsKafkaPresenceAndAckService: New thread started.");
            var config = new ConsumerConfig(_kafkaConfig);

            Log.LogInformation("RtmsKafkaPresenceAndAckService: Creating Consumer builder object.");
            using IConsumer<Ignore, string> consumer = new ConsumerBuilder<Ignore, string>(config).SetErrorHandler(
                (_, error) =>
                {
                    Log.LogError($"Not able to consume Rtms Kafka Presence Message for reason: {error.Reason}", error);
                }).Build();

            Log.LogInformation("RtmsKafkaPresenceAndAckService: Consumer builder object created.");

            try
            {
                Log.LogInformation("RtmsKafkaPresenceAndAckService: Trying to subscribe topics.");
                consumer.Subscribe(_topics);
                Log.LogInformation("RtmsKafkaPresenceAndAckService: Subscribed to topics.");

                _shouldKeepRunning = true;

                using SemaphoreSlim concurrencySemaphore = new SemaphoreSlim(_maxParallelThreadToConsumeMessages);
                while (_shouldKeepRunning)
                {
                    try
                    {
                        ConsumeResult<Ignore, string> consumeResult = consumer.Consume(_consumeTimeOut);

                        if (consumeResult?.Message?.Value != null)
                        {
                            if (consumeResult.Topic.Contains("presence"))
                            {
                                await concurrencySemaphore.WaitAsync();
                                Log.LogInformation($"Got Presence message at TimeStamp: {DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}, message:{consumeResult.Message.Value}, Message reached into Kafka at {consumeResult.Message.Timestamp.UtcDateTime.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}");

                                _ = Task.Run(async () =>
                                {
                                    try
                                    {
                                        await SendWithHttpGetRequest(consumeResult.Message.Value);
                                    }
                                    catch (Exception ex)
                                    {
                                        Log.LogError(ex, ex.Message);
                                    }
                                    finally
                                    {
                                        concurrencySemaphore.Release();
                                    }
                                });
                                Log.LogInformation($"Finished creating thread to consume above message at TimeStamp: {DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}, message:{consumeResult.Message.Value}");
                            }
                            else
                            {
                                Log.LogInformation($"RTMS Kafka Acknowledgement : {consumeResult?.Message?.Value}");
                            }
                        }
                        else if(consumeResult != null && consumeResult.Message?.Value == null)
                        {
                            Log.LogInformation($"RTMS Kafka got empty message");
                        }
                    }
                    catch (Exception e)
                    {
                        Log.LogError(e, e.Message);
                    }
                }
            }
            finally
            {
                consumer.Close();
            }
        }

        protected override Task StoppingDoWork()
        {
            _shouldKeepRunning = false;

            return Task.CompletedTask;
        }

        private async Task SendWithHttpGetRequest(string presenceMessageParam)
        {
            string env = string.Empty;
            string brandUrl = string.Empty;

            try
            {
                var presenceMessage = JsonConvert.DeserializeObject<PresenceMessage>(presenceMessageParam, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });

                if (presenceMessage.Sender.device.ToLower().Contains(ConstantsPropertyValues.RtmsPresenceMessageDeviceId) && presenceMessage.Type?.ToUpper() == ConstantsPropertyValues.RtmAppConnect)
                {
                    env = GantryEnvironment.GetUrlBasedOnEnv(_config.GetValue<string>("Environment")?.ToLowerInvariant());
                    using var client = new HttpClient();
                    brandUrl = _brandUrl.GetBrandUrl(presenceMessage, _brandUrlMapper);

                    if (string.IsNullOrEmpty(brandUrl))
                    {
                        brandUrl = "gantry.coral.co.uk";
                    }

                    Log.LogInformation($"Trying to make API call to process Presence message from RTMS with Url: {env}{brandUrl}/en/api/ProcessPresenceMessage");

                    var urlBuilder = new UriBuilder($"{env}{brandUrl}/en/api/ProcessPresenceMessage");
                    urlBuilder.AddQueryParameters(("presenceMessageParam", presenceMessageParam));
                    HttpResponseMessage result = await client.GetAsync(urlBuilder.Uri);

                    Log.LogInformation($"Process API call for PRESENCE MESSAGE succeeds: {result}");
                }
                else
                {
                    Log.LogInformation($"RTMS presence message deviceId does n't contains {ConstantsPropertyValues.RtmsPresenceMessageDeviceId} OR Presence Message Type is NOT {ConstantsPropertyValues.RtmAppConnect}. So Ignoring this message: {presenceMessageParam}");
                }
            }
            catch (Exception e)
            {
                Log.LogInformation($"Failed API call to process Presence message with Url: {env}{brandUrl}/en/api/ProcessPresenceMessage");
                Log.LogError(e, e.Message);
            }
        }

        
    }
}