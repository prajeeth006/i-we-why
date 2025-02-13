using Bwin.Vanilla.Core.Configuration;
using Bwin.Vanilla.Core.Net;
using Frontend.Gantry.Shared.Core.Attributes;
using Frontend.Gantry.Shared.Core.BackgroundJob;
using Frontend.Gantry.Shared.Core.BusinessLogic.Cache.Services;
using Frontend.Gantry.Shared.Core.Services.Kafka.Jobs;
using Frontend.Gantry.Shared.Middlewares;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Frontend.Gantry.Controllers
{
    [GantryBootstrapAuthenticationFilter, GantryBootstrapPreviewHeaderFilter]
    public class GantryClientBootstrapController : Controller
    {
        private readonly IJobScheduler _jobScheduler;
        private readonly IInitializeDistributedCacheService _initializeDistributedCacheService;
        private readonly IInternalRequestEvaluator _internalRequestEvaluator;
        private readonly IEnvironmentProvider _iEnvironmentProvider;

        public GantryClientBootstrapController(
            IJobScheduler jobScheduler,
            IInternalRequestEvaluator internalRequestEvaluator, IInitializeDistributedCacheService initializeDistributedCacheService, IEnvironmentProvider iEnvironmentProvider)
        {
            _jobScheduler = jobScheduler;
            _internalRequestEvaluator = internalRequestEvaluator;
            _initializeDistributedCacheService = initializeDistributedCacheService;
            _iEnvironmentProvider = iEnvironmentProvider;
        }

        public async Task<ActionResult> GantryBootstrap()
        {
            await _initializeDistributedCacheService.Initialize();
            _jobScheduler.StartJob<ConsumeKafkaRtmsPresenceJob>();
            _jobScheduler.StartJob<ConsumeKafkaSiteCoreJob>();
            SetDomainInViewBag();
            SetEnvironmentViewBag();
            SetServerNameInViewBag();
            return View("GantryClientBootstrap");
        }

        private void SetDomainInViewBag()
        {
            ViewBag.domain = HttpContext.Items["Van:Label"];
        }

        private void SetEnvironmentViewBag()
        {
            ViewBag.IsProduction = _iEnvironmentProvider.IsProduction;
        }
        private void SetServerNameInViewBag()
        {
            ViewBag.serverName = Environment.MachineName;
        }
    }
}