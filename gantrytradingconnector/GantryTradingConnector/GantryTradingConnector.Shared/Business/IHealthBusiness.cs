using GantryTradingConnector.Shared.GraphQL.Responses;
using GantryTradingConnector.Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace GantryTradingConnector.Shared.Business
{
    public interface IHealthBusiness
    {
        Task<HealthConnectionResponse> GetTcpHostConnectionResponse(HttpContext? httpContext);
    }
}
