using GantryTradingConnector.Shared.GraphQL.Responses;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Services
{
    public interface IHealthDataService
    {
        Task<HealthConnectionResponse> GetTcpHostConnectionResponse(HttpContext? httpContext);
    }
}
