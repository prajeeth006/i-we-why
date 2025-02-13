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
    public class ProcessSiteCoreKafkaMessageApiController : BaseApiController
    {
        private readonly IKafkaSiteCoreMessageProcessor _kafkaSiteCoreMessageProcessor;
        private readonly ILogger<ProcessSiteCoreKafkaMessageApiController> _log;

        public ProcessSiteCoreKafkaMessageApiController(
            IKafkaSiteCoreMessageProcessor kafkaSiteCoreMessageProcessor, ILogger<ProcessSiteCoreKafkaMessageApiController> log)
        {
            _kafkaSiteCoreMessageProcessor = kafkaSiteCoreMessageProcessor;
            _log = log;
        }

        [HttpGet("ProcessSiteCoreKafkaMessage"), ProducesResponseType(StatusCodes.Status200OK, Type = (typeof(bool)))]
        public async Task<IActionResult> ProcessSiteCoreKafkaMessage(string siteCoreItemDetailsMessageParam)
        {
            _log.LogInformation("ProcessSiteCoreKafkaMessage API CALLED");
            var siteCoreItemDetailsMessage = JsonConvert.DeserializeObject<SiteCoreItemDetailsMessage>(
                siteCoreItemDetailsMessageParam,
                new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore
                });

            await _kafkaSiteCoreMessageProcessor.ProcessSiteCoreItemDetails(siteCoreItemDetailsMessage);

            return new JsonResult(true);
        }
    }
}