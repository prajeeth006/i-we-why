using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Frontend.Gantry.Host.Controllers;
using Frontend.Gantry.Shared.Core.Services.Kafka.Jobs;
using Frontend.Gantry.Shared.Core.BackgroundJob;
using Microsoft.Extensions.Logging;
using Frontend.Gantry.Shared.Configuration;

namespace Frontend.Gantry.Controllers
{
    [Area(GantryDynaconConfiguration.AreaName)]
    [Route("{culture}/api")]
    public class PresenceMessageJobController : BaseApiController
    {
        private readonly IJobScheduler _jobScheduler;
        private readonly ILogger<PresenceMessageJobController> _logger;
        private readonly IRtmsKafkaConsumerConfig _rtmsKafkaConsumerConfig;

        public PresenceMessageJobController(IJobScheduler jobScheduler, ILogger<PresenceMessageJobController> logger, IRtmsKafkaConsumerConfig rtmsKafkaConsumerConfig)
        {
            _jobScheduler = jobScheduler;
            _logger = logger;
            _rtmsKafkaConsumerConfig = rtmsKafkaConsumerConfig;
        }


        [HttpGet]
        [Route("startPresenceJob")]
        public async Task<IActionResult> StartJob()
        {
            try
            {
                if (_rtmsKafkaConsumerConfig.IsConsumerKafkaRtmsPresenceJobEnabled)
                {
                    _jobScheduler.StartJob<ConsumeKafkaRtmsPresenceJob>();
                }
                Thread.Sleep(1000);
                var jobList = _jobScheduler.GetJobs();
                return Ok(jobList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message, this);
                return BadRequest(e.Message);
            }
        }


        [HttpGet]
        [Route("stopPresenceJob")]
        public async Task<IActionResult> Stopjob()
        {
            try
            {
                _jobScheduler.StopJob<ConsumeKafkaRtmsPresenceJob>();
                var jobList = _jobScheduler.GetJobs();
                return Ok(jobList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message, this);
                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("jobs")]
        public async Task<IActionResult> GetJobs()
        {
            try
            {
                var jobList = _jobScheduler.GetJobs();
                return Ok(jobList);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message, this);
                return BadRequest(e.Message);
            }
        }


    }
}
