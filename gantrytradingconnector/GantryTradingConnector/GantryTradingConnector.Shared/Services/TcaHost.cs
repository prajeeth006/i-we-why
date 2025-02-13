using GantryTradingConnector.Shared.Config;
using GantryTradingConnector.Shared.GraphQL.Responses;
using Microsoft.Extensions.Options;
using System.Diagnostics;
using System.Net.Http;
using System.Net.Sockets;

namespace GantryTradingConnector.Shared.Services
{
    public class TcaHost : ITradingHost
    {
        private readonly IOptions<TradingContentApiConfiguration> _tcaConfig;

        public TcaHost(IOptions<TradingContentApiConfiguration> tcaConfig)
        {
            _tcaConfig = tcaConfig;
        }

        public async Task<FeatureHealth> GetHostConnection()
        {
            var fh = new FeatureHealth
            {
                Description =
                    "TCA connection. It is used to get Sport, Regions, Competitions, Events. If this is down then It will affect displayManager left panel.",
                WhatToDoIfFailed =
                    $"Check connectivity between this server: {Environment.MachineName} and the TCA services. Check TCA services are up or not.",
                Details = new Details
                {
                    RequestUrl = _tcaConfig.Value.Endpoint,
                }
            };
            var sw = Stopwatch.StartNew();

            Uri uri = new Uri(_tcaConfig.Value.Endpoint);

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
