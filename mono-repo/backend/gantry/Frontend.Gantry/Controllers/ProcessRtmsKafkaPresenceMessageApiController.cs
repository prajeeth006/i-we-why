using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.BusinessLogic;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Frontend.Gantry.Controllers
{
    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class ProcessRtmsKafkaPresenceMessageApiController : BaseApiController
    {
        private readonly IKafkaPresenceMessageProcessor _kafkaPresenceMessageProcessor;
        private readonly ILogger<ProcessRtmsKafkaPresenceMessageApiController> _log;
        private readonly IRtmsKafkaConsumerConfig _rtmsKafkaConsumerConfig;

        public ProcessRtmsKafkaPresenceMessageApiController(
            IKafkaPresenceMessageProcessor kafkaPresenceMessageProcessor, ILogger<ProcessRtmsKafkaPresenceMessageApiController> log, IRtmsKafkaConsumerConfig rtmsKafkaConsumerConfig)
        {
            _kafkaPresenceMessageProcessor = kafkaPresenceMessageProcessor;
            _log = log;
            _rtmsKafkaConsumerConfig = rtmsKafkaConsumerConfig;
        }

        [HttpGet("ProcessPresenceMessage"), ProducesResponseType(StatusCodes.Status200OK, Type = (typeof(bool)))]
        public async Task<IActionResult> ProcessRtmsKafkaPresenceMessage(string presenceMessageParam)
        {
            try
            {
                _log.LogInformation("ProcessPresenceMessage API CALLED");

                var presenceMessage =
                    JsonConvert.DeserializeObject<PresenceMessage>(presenceMessageParam,
                        new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });

                if (!_rtmsKafkaConsumerConfig.IsConsumerKafkaRtmsProcessPresenceEnabled)
                {
                    _log.LogInformation($"Presence message SID: {presenceMessage.Sid} disabled processing of Presence message so, skipping the message.");
                    return new JsonResult(false);
                }

                _log.LogInformation($"RTMS presence message processor called with this message: {presenceMessageParam}");
                await _kafkaPresenceMessageProcessor.ProcessPresenceMessage(presenceMessage);

                return new JsonResult(true);
            }
            catch (Exception e)
            {
                _log.LogError(e,e.Message);
                return new JsonResult(false);
            }
        }


    }
}
