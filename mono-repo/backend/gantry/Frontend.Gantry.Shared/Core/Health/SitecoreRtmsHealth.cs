using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Frontend.Gantry.Shared.Core.Models.ViewModels;
using Frontend.Gantry.Shared.Core.Services.SiteCore;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Frontend.Gantry.Shared.Core.Health
{

    public interface ISitecoreRtmsHealth
    {
        Task<List<HostConnection>> getSiteCoreKafkaHealthDetails(string siteCoreKafkaDetails);
        Task<List<HostConnection>> getRtmsKafkaDetails(string rtmsKafkaDetails);
    }

    public class SitecoreRtmsHealth : IHealthCheck, ISitecoreRtmsHealth
    {
        private readonly ISiteCoreKafkaConsumerConfig _siteCoreKafkaConfig;
        private readonly IRtmsKafkaConsumerConfig _rtmsKafkaConfig;
        private readonly ILogger<SitecoreRtmsHealth> _log;
        public bool IsEnabled => true;

        public HealthCheckMetadata Metadata { get; } = new HealthCheckMetadata(
            "GBS Kafka Connectivity health",
            $"Checks the connectivity between gantry and GBS kakfa. This is used to Produce message to GBS kafka which further consumed by electron through RTMS client and loads it on screen in gantry shops.",
            "Check with LCG and Digital network team if this fails.",
            HealthCheckSeverity.Critical);

        public async Task<HealthCheckResult> ExecuteAsync(CancellationToken cancellationToken)
        {

            var watch = Stopwatch.StartNew();

            bool okay;
            string statusDescription;
            Hosts hosts = new Hosts
            {
                sitecoreHostConnections = new List<HostConnection>(),
                rtmsHostConnections = new List<HostConnection>()
            };
            var getsiteCoreKafkaDetails = _siteCoreKafkaConfig.ConsumerConfig["bootstrap.servers"];
            var getrtmsKafkaDetails = _rtmsKafkaConfig.ConsumerConfig["bootstrap.servers"];

            try
            {
                if (!string.IsNullOrWhiteSpace(getsiteCoreKafkaDetails))
                {
                    hosts.sitecoreHostConnections = await getSiteCoreKafkaHealthDetails(getsiteCoreKafkaDetails);
                }

                if (!string.IsNullOrWhiteSpace(getrtmsKafkaDetails))
                {

                    hosts.rtmsHostConnections = await getRtmsKafkaDetails(getrtmsKafkaDetails);
                }
            }
            catch (Exception exception)
            {
                okay = false;
                statusDescription = exception.Message;
            }
            watch.Stop();

            var details = new
            { 
                rtmsHostConnections = hosts.rtmsHostConnections,
                sitecoreHostConnections = hosts.sitecoreHostConnections
            };
            return true ? HealthCheckResult.CreateSuccess(details) : HealthCheckResult.CreateFailed(statusDescription, details);
        }

        public SitecoreRtmsHealth(ISiteCoreKafkaConsumerConfig siteCoreKafkaConfig, IRtmsKafkaConsumerConfig rtmsKafkaConfig, ILogger<SitecoreRtmsHealth> log)
        {
            _siteCoreKafkaConfig = siteCoreKafkaConfig;
            _rtmsKafkaConfig = rtmsKafkaConfig;
            _log = log;
        }


        public async Task<List<HostConnection>> getSiteCoreKafkaHealthDetails(string siteCoreKafkaDetails)
        {

            List<HostConnection> hosts = new List<HostConnection>();

            if (!string.IsNullOrWhiteSpace(siteCoreKafkaDetails))
            {
                try
                {
                    foreach (var siteCoreKafka in siteCoreKafkaDetails?.Split(','))
                    {
                        if (string.IsNullOrWhiteSpace(siteCoreKafka)) continue;
                        var hostName = siteCoreKafka.Split(':')[0].Trim();
                        var port = Convert.ToInt32(siteCoreKafka.Split(':')[1].Trim());
                        TcpClient? tc = null;
                        try
                        {
                            using (tc = new TcpClient(hostName, port))
                            {
                                hosts.Add(new HostConnection
                                {
                                    ConnectionName = siteCoreKafka,
                                    Connection = tc.Connected
                                });
                            }
                        }
                        catch (Exception e)
                        {
                            hosts.Add(new HostConnection
                            {
                                ConnectionName = siteCoreKafka,
                                Connection = false
                            });
                             _log.LogError(e, e.Message);
                        }
                        finally
                        {
                            tc?.Close();
                        }
                    }
                }
                catch (Exception e)
                {
                    _log.LogError(e, e.Message);
                }
            }

            return hosts;
        }

        public async Task<List<HostConnection>> getRtmsKafkaDetails(string rtmsKafkaDetails)
        {
            List<HostConnection> hosts = new List<HostConnection>();

            if (!string.IsNullOrWhiteSpace(rtmsKafkaDetails))
            {
                try
                {
                    foreach (var rtmsKafka in rtmsKafkaDetails?.Split(','))
                    {
                        if (string.IsNullOrWhiteSpace(rtmsKafka)) continue;
                        var hostName = rtmsKafka.Split(':')[0].Trim();
                        var port = Convert.ToInt32(rtmsKafka.Split(':')[1].Trim());
                        TcpClient? tc = null;
                        try
                        {
                            using (tc = new TcpClient(hostName, port))
                            {
                                hosts.Add(new HostConnection
                                {
                                    ConnectionName = rtmsKafka,
                                    Connection = tc.Connected
                                });
                            }
                        }
                        catch (Exception e)
                        {
                            // _log.LogError(e, e.Message);
                            hosts.Add(new HostConnection
                            {
                                ConnectionName = rtmsKafka,
                                Connection = false
                            });
                        }
                        finally
                        {
                            tc?.Close();
                        }
                    }
                }
                catch (Exception e)
                {
                     _log.LogError(e, e.Message);
                }
            }

            return hosts;
        }


    }
}
