using GantryTradingConnector.Shared.Config;
using GantryTradingConnector.Shared.GraphQL.Responses;
using Microsoft.Extensions.Options;
using System.Diagnostics;
using System.Net.Sockets;

namespace GantryTradingConnector.Shared.Services
{
    public class TradingHost : ITradingHost
    {
        private readonly IOptions<TradingApiConfiguration> _tradingApiConfig;

        public TradingHost(IOptions<TradingApiConfiguration> tradingApiConfig)
        {
            _tradingApiConfig = tradingApiConfig;
        }

        public async Task<FeatureHealth> GetHostConnection()
        {
            var sw = Stopwatch.StartNew();
            var fh = new FeatureHealth
            {
                Description =
                    "TradingApi connection. It is used to get markets details of events. If this is down then It will affect displayManager left panel drag and drop assets.",
                WhatToDoIfFailed =
                    $"Check connectivity between this server: {Environment.MachineName} and the TCA services. Check TradingApi services are up or not.",
                Details = new Details
                {
                    RequestUrl = _tradingApiConfig.Value.Endpoint,
                }
            };
            
            Uri uri = new Uri(_tradingApiConfig.Value.Endpoint);

            try
            {
                TcpClient tc;
                using (tc = new TcpClient(uri.Host, uri.Port))
                {
                    try
                    {
                        fh.Passed = tc.Connected;
                        fh.Details.Response = fh.Passed ? "Through TCP was able to connect" : "Through TCP failed to connect";
                    }
                    catch (SocketException)
                    {
                        fh.Passed = false;
                        fh.Details.Response = "Through TCP failed to connect";
                    }
                }
            }
            catch (Exception e)
            {
                fh.Passed = false;
                fh.Details.Response = "Through TCP failed to connect";
            }
            finally
            {
                sw.Stop();
                fh.ExecutionTime = sw.Elapsed.ToString(@"hh\:mm\:ss\:fff");
            }

            return fh;
        }
    }
}
