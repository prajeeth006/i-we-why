using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Frontend.Gantry.Controllers
{
    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class TestingKibanaLoggingApiController : BaseApiController
    {
        
        private readonly ILogger<TestingKibanaLoggingApiController> _log;

        public TestingKibanaLoggingApiController(ILogger<TestingKibanaLoggingApiController> log)
        {
            _log = log;
        }

        [HttpGet("pushmessage"), Produces(typeof(HttpResponseMessage))]
        public void ProcessSiteCoreKafkaMessage()
        {
            _log.LogInformation("ProcessSiteCoreKafkaMessage test API CALLED");
            RtmsMessageDetailsMessage rtmsMessageDetailsMessage = new RtmsMessageDetailsMessage()
            {
                eid = "123",
                source = "Test Gantry"
            };
            using (_log.BeginScope(new Dictionary<string, object> {

                { "targetId", "targetId" },
                { "target", "TargetItemPath" },
                { "details.ClientId", "shopid" },
                { "Host", "Location" },
                { "EventId", 123 }, 
                { "type", "typeid111" },
                { "request.Content.Value.brandId", "brand111" },
                { "EventIdCategoryName","cateogory111"},
                }))
            {
                _log.LogInformation("ProcessSiteCoreKafkaMessage test API with BeginScope CALLED");
            }
        }
    }
}