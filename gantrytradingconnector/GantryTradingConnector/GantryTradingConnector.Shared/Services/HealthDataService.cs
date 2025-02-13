using GantryTradingConnector.Shared.Config;
using GantryTradingConnector.Shared.GraphQL.Responses;
using GantryTradingConnector.Shared.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Security.Cryptography.X509Certificates;
using GantryTradingConnector.Shared.Utilities;

namespace GantryTradingConnector.Shared.Services
{
    public class HealthDataService : IHealthDataService
    {
     
        private readonly Func<int, ITradingHost> _tradingHost;

        public HealthDataService(Func<int, ITradingHost> tradingHost)
        {
            _tradingHost = tradingHost;
        }

        public async Task<HealthConnectionResponse> GetTcpHostConnectionResponse(HttpContext? httpContext)
        {
            HealthConnectionResponse healthConnectionResponse = new HealthConnectionResponse();
            healthConnectionResponse.clientIP = IpExtensions.GetClientIpAddress(httpContext);
            ConnectionInfo? connectionInfo = httpContext?.Connection;
            healthConnectionResponse.Details = new Dictionary<string, FeatureHealth>();

            if (connectionInfo != null)
            {
                healthConnectionResponse.ServerId = Convert.ToString(connectionInfo.LocalIpAddress);

                healthConnectionResponse.Environment = Convert.ToString(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"));
                var connectionResponseTca = await _tradingHost((int)ConstantHelper.TradingType.TCA).GetHostConnection();
                var connectionResponseTrading = await _tradingHost((int)ConstantHelper.TradingType.TRADING).GetHostConnection();
                var connectionResponseBcp = await _tradingHost((int)ConstantHelper.TradingType.BCP).GetHostConnection();

                healthConnectionResponse.Details.Add("[CRITICAL] TCA connection", connectionResponseTca);

                healthConnectionResponse.Details.Add("[CRITICAL] TradingAPI connection", connectionResponseTrading);

                healthConnectionResponse.Details.Add("[CRITICAL] BcpAPI connection", connectionResponseBcp);

                if (!connectionResponseTca.Passed || !connectionResponseTrading.Passed || !connectionResponseBcp.Passed)
                {
                    healthConnectionResponse.AllPassed = false;
                }
            }

            return healthConnectionResponse;
        }
    }
}
