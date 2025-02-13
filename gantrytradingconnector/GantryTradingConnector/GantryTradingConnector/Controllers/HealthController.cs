using GantryTradingConnector.Shared.Business;
using Microsoft.AspNetCore.Mvc;

namespace GantryTradingConnector.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        private readonly IHealthBusiness _healthBusiness;
        private readonly IHttpContextAccessor _httpContext;
        public HealthController(IHttpContextAccessor httpContext, IHealthBusiness healthBusiness)
        {
            _healthBusiness = healthBusiness;
            _httpContext = httpContext;
        }

        [HttpGet]
        public async Task<IActionResult> TcpConnectionStatus()
        {
            var data = await _healthBusiness.GetTcpHostConnectionResponse(_httpContext.HttpContext);

            return Ok(data);
        }

        [HttpGet]
        [Route("TestAspNetCoreEnvironment")]
        public async Task<IActionResult> TestAspNetCoreEnvironment()
        {
            return Ok(Convert.ToString(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"))?.ToLower());
        }

        [HttpGet]
        [Route("TestEnvironmentVariables")]
        public async Task<IActionResult> TestEnvironmentVariables()
        {
            var data = Environment.GetEnvironmentVariables();

            return Ok(data);
        }
    }
}
