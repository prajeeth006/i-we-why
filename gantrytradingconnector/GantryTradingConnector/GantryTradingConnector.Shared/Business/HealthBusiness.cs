using GantryTradingConnector.Shared.GraphQL.Responses;
using GantryTradingConnector.Shared.Services;
using Microsoft.AspNetCore.Http;

namespace GantryTradingConnector.Shared.Business
{
    public class HealthBusiness:IHealthBusiness
    {
        private readonly IHealthDataService _healthDataService;

        public HealthBusiness(IHealthDataService healthDataService)
        {
            _healthDataService = healthDataService;
        }
        public async Task<HealthConnectionResponse> GetTcpHostConnectionResponse(HttpContext? httpContext)
        {
            HealthConnectionResponse healthConnectionResponse = await _healthDataService.GetTcpHostConnectionResponse(httpContext);

            return healthConnectionResponse;
        }
    }
}
