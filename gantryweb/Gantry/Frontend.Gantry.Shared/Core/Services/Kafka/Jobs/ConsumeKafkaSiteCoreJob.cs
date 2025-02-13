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
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Frontend.Gantry.Shared.Core.Services.Kafka.Jobs
{
    public class ConsumeKafkaSiteCoreJob : BaseJob
    {
        private bool _shouldKeepRunning = true;
        private readonly ISiteCoreKafkaConsumerConfig _siteCoreKafkaConsumerConfig;
        private readonly IBrandUrl _brandUrl;
        private readonly IGantryBrandUrlMapping _gantryBrandUrlMapping;
        private readonly IDisplayManagerScreens _displayManagerScreens;
        private readonly IConfiguration _configuration;

        //Below we need to check if we can inject it directly in rtms service when we have application start event through vanilla. Right now it will not work 
        //as we dont have httpcontext in another thread and we cant pass it as httpcontext is not thread safe.
        private IDictionary<string, string> _kafkaConfig = new ConcurrentDictionary<string, string>();
        private string[] _topics = {};
        private string _siteCoreTemplateNames;
        private int _consumeTimeOut;
        private int _maxParallelThreadToConsumeMessages;
        private IDictionary<string, string> _brandUrlMapper = new ConcurrentDictionary<string, string>();
        private string _displayManagerScreenPathWithoutLabelName;
        private IConfiguration _config;


        public ConsumeKafkaSiteCoreJob(
            ISiteCoreKafkaConsumerConfig siteCoreKafkaConsumerConfig,
            ILogger<ConsumeKafkaSiteCoreJob> log, IBrandUrl brandUrl, IGantryBrandUrlMapping gantryBrandUrlMapping, IDisplayManagerScreens displayManagerScreens, IConfiguration configuration) 
            : base(log)
        {
            _siteCoreKafkaConsumerConfig = siteCoreKafkaConsumerConfig;
            _brandUrl = brandUrl;
            _gantryBrandUrlMapping = gantryBrandUrlMapping;
            _displayManagerScreens = displayManagerScreens;
            _configuration = configuration;
        }

        protected override void DoPreWorkBeforeOwnThreadStarts()
        {
            _kafkaConfig = _siteCoreKafkaConsumerConfig.ConsumerConfig;
            _siteCoreTemplateNames = _siteCoreKafkaConsumerConfig?.SiteCoreTemplateConfig?.ToLower();
            _topics = _siteCoreKafkaConsumerConfig.TopicsToConsume.Split(',');
            _consumeTimeOut = _siteCoreKafkaConsumerConfig.ConsumeTimeOut;
            _brandUrlMapper = _gantryBrandUrlMapping.BrandUrlMapper;
            _displayManagerScreenPathWithoutLabelName = _displayManagerScreens.ScreensPathWithoutLabelName;
            _maxParallelThreadToConsumeMessages = _siteCoreKafkaConsumerConfig.MaxParallelThreadToConsumeMessages == 0 ? 25 : _siteCoreKafkaConsumerConfig.MaxParallelThreadToConsumeMessages;
            _config = _configuration;
        }

        protected override async Task DoWorkInOwnThread()
        {
            var config = new ConsumerConfig(_kafkaConfig);

            Log.LogInformation("Creating Consumer builder object.");
            
            using IConsumer<Ignore, string> consumer = new ConsumerBuilder<Ignore, string>(config).SetErrorHandler(
                (_, error) =>
                {
                    Log.LogError($"Not able to consume SiteCore kafka for reason: {error.Reason}", error);
                }).Build();

            Log.LogInformation("Consumer builder object created.");

            try
            {
                Log.LogInformation("Trying to subscribe topics.");
                consumer.Subscribe(_topics);
                Log.LogInformation("Subscribed to topics.");
                _shouldKeepRunning = true;

                using SemaphoreSlim concurrencySemaphore = new SemaphoreSlim(_maxParallelThreadToConsumeMessages);

                while (_shouldKeepRunning)
                {
                    try
                    {
                        // Commenting the code to test the CPU & Memory Utilization and adding Await and Delay
                        //ConsumeResult<Ignore, string> consumeResult = consumer.Consume(_consumeTimeOut);
                        ConsumeResult<Ignore, string> consumeResult = await Task.Run(() => consumer.Consume(_consumeTimeOut));
                        
                        if (!string.IsNullOrEmpty(consumeResult?.Message?.Value))
                        {
                            if (ValidateTemplateNameinKafkaMessage(consumeResult.Message.Value))
                            {
                                await concurrencySemaphore.WaitAsync();
                                await Task.Delay(100);
                                Log.LogInformation($"Got sitecore message at TimeStamp: {DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}, message:{consumeResult.Message.Value}, Message reached into Kafka at {consumeResult.Message.Timestamp.UtcDateTime.ToString("yyyy-MM-dd HH:mm:ss.fff", CultureInfo.InvariantCulture)}");

                                _ = Task.Run(async () =>
                                {
                                    try
                                    {
                                        await SendWithHttpGetRequest(consumeResult.Message.Value);
                                    }
                                    catch (Exception e)
                                    {
                                        Log.LogError(e, e.Message);
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
                                Log.LogError($"Received Template Name is not in the list which we are Allowing {_siteCoreTemplateNames} in Kafka message {consumeResult?.Message?.Value}");
                            }
                        }
                        else if (consumeResult != null && consumeResult.Message?.Value == null)
                        {
                            Log.LogInformation($"Sitecore Kafka got empty message");
                        }

                        

                    }
                    catch (Exception e)
                    {
                        Log.LogError(e, e.Message);
                    }
                }
            }
            catch (Exception e)
            {
                Log.LogError(e, e.Message);
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

        private async Task SendWithHttpGetRequest(string messageSiteCoreItemDetailsString)
        {
            UriBuilder urlBuilder = null;
            try
            {
                    string env = GantryEnvironment.GetUrlBasedOnEnv(_config.GetValue<string>("Environment")?.ToLowerInvariant());
                    using var client = new HttpClient();
                    string brandUrl = _brandUrl.GetBrandUrl(messageSiteCoreItemDetailsString, _brandUrlMapper, _displayManagerScreenPathWithoutLabelName);

                    if (string.IsNullOrEmpty(brandUrl))
                    {
                        brandUrl = "gantry.coral.co.uk";
                    }
                    urlBuilder = new UriBuilder($"{env}{brandUrl}/en/api/ProcessSiteCoreKafkaMessage");
                    urlBuilder.AddQueryParameters(("siteCoreItemDetailsMessageParam", messageSiteCoreItemDetailsString));
                    Log.LogInformation($"Trying to make API call to process SitecoreKafka message with Url: {urlBuilder.Uri}");
                    HttpResponseMessage result = await client.GetAsync(urlBuilder.Uri);

                    Log.LogInformation($"Process API call succeeds: {result}");                

            }
            catch (Exception e)
            {
                Log.LogError($"Failed API call to process SitecoreKafka message with Url: {urlBuilder?.Uri}");
                Log.LogError(e, e.Message);
            }
        }

        public bool ValidateTemplateNameinKafkaMessage(string messageSiteCoreItemDetailsString)
        {
            try
            {
                var siteCoreItemDetailsMessage = JsonConvert.DeserializeObject<SiteCoreItemDetailsMessage>(
                                    messageSiteCoreItemDetailsString,
                                    new JsonSerializerSettings
                                    {
                                        NullValueHandling = NullValueHandling.Ignore
                                    });

                if (!string.IsNullOrEmpty(siteCoreItemDetailsMessage?.TemplateName))
                {
                    return _siteCoreTemplateNames.Contains(siteCoreItemDetailsMessage?.TemplateName?.ToLower());
                }
                else
                {
                    return false;
                }
            }
            catch (Exception e)
            {
                Log.LogError(e, $"Validation of Template Name in Kafka message Failed: {e.Message}");
                return false;
            }
                        
        }
    }
}