using GantryTradingConnector.Shared.Config;
using GantryTradingConnector.Shared.GraphQL.Responses;
using Microsoft.Extensions.Options;
using System.Diagnostics;
using System.Net.Http;
using System.Net.Sockets;
using GantryTradingConnector.Shared.GraphQL.Config;

namespace GantryTradingConnector.Shared.Services
{
    public class BcpHost : ITradingHost
    {
        private readonly IOptions<BcpApiConfiguration> _bcpConfig;

        public BcpHost(IOptions<BcpApiConfiguration> bcpConfig)
        {
            _bcpConfig = bcpConfig;
        }

        public async Task<FeatureHealth> GetHostConnection()
        {
            var fh = new FeatureHealth
            {
                Description =
                    "BCP connection. It is used to get market details for particular fixture for TV1 sports. If this is down then It will affect displayManager left panel.",
                WhatToDoIfFailed =
                    $"Check connectivity between this server: {Environment.MachineName} and the BCP services. Check BCP services are up or not. Check BCP health in case of any issues http://bcp.prod.env.works/Service.svc/diagnostics/health",
                Details = new Details
                {
                    RequestUrl = _bcpConfig.Value.Endpoint,
                }
            };
            var sw = Stopwatch.StartNew();

            Uri uri = new Uri(_bcpConfig.Value.Endpoint);

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
