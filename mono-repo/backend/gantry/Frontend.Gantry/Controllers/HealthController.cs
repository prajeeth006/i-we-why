using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.Health;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Frontend.Gantry.Shared.Core.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Threading.Tasks;

namespace Frontend.Gantry.Controllers
{
    [AllowAnonymous]
    public class HealthController : Controller
    {
        private readonly ISiteCoreKafkaConsumerConfig _siteCoreKafkaConfig;
        private readonly IRtmsKafkaConsumerConfig _rtmsKafkaConfig;
        private readonly ISitecoreRtmsHealth _iSitecoreRtmsHealth;
        public HealthController(ISiteCoreKafkaConsumerConfig siteCoreKafkaConfig, IRtmsKafkaConsumerConfig rtmsKafkaConfig,ISitecoreRtmsHealth iSitecoreRtmsHealth)
        {
            _siteCoreKafkaConfig = siteCoreKafkaConfig;
            _rtmsKafkaConfig = rtmsKafkaConfig;
            _iSitecoreRtmsHealth = iSitecoreRtmsHealth;
        }


        [Route("{culture}/gantry/health")]
        // GET: Health
        public async Task<ActionResult> Health()
        {
            Hosts hosts = new Hosts
            {
                sitecoreHostConnections = new List<HostConnection>(),
                rtmsHostConnections = new List<HostConnection>()
            };

            var getsiteCoreKafkaDetails = _siteCoreKafkaConfig.ConsumerConfig["bootstrap.servers"];
            var getrtmsKafkaDetails = _rtmsKafkaConfig.ConsumerConfig["bootstrap.servers"];

            if (!string.IsNullOrWhiteSpace(getsiteCoreKafkaDetails))
            {
                hosts.sitecoreHostConnections = await _iSitecoreRtmsHealth.getSiteCoreKafkaHealthDetails(getsiteCoreKafkaDetails);
            }

            if (string.IsNullOrWhiteSpace(getrtmsKafkaDetails)) return await Task.FromResult<ActionResult>(View("HealthDetails", hosts));
            {

                hosts.rtmsHostConnections = await _iSitecoreRtmsHealth.getRtmsKafkaDetails(getrtmsKafkaDetails);
            }
            return await Task.FromResult<ActionResult>(View("HealthDetails", hosts));
        }
    }
}
