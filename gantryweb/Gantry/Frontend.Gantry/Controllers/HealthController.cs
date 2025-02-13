using Frontend.Gantry.Shared.Configuration;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Frontend.Gantry.Shared.Core.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net.Sockets;
using System.Threading.Tasks;

namespace Frontend.Gantry.Controllers
{
    [AllowAnonymous]
    public class HealthController : Controller
    {
        private readonly ISiteCoreKafkaConsumerConfig _siteCoreKafkaConfig;
        private readonly IRtmsKafkaConsumerConfig _rtmsKafkaConfig;
        private readonly ILogger<HealthController> _log;
        public HealthController(ISiteCoreKafkaConsumerConfig siteCoreKafkaConfig, IRtmsKafkaConsumerConfig rtmsKafkaConfig, ILogger<HealthController> log)
        {
            _siteCoreKafkaConfig = siteCoreKafkaConfig;
            _rtmsKafkaConfig = rtmsKafkaConfig;
            _log = log;
        }


        [Route("{culture}/gantry/health")]
        // GET: Health
        public async Task<ActionResult> Health()
        {
            Hosts hosts = new Hosts
            {
                sitecoreHostConnections = new List<HostConnection>(),
                rtmsHostConnections = new List<HostConnection>()
            };

            var getsiteCoreKafkaDetails = _siteCoreKafkaConfig.ConsumerConfig["bootstrap.servers"];
            var getrtmsKafkaDetails = _rtmsKafkaConfig.ConsumerConfig["bootstrap.servers"];

            if (!string.IsNullOrWhiteSpace(getsiteCoreKafkaDetails))
            {
                try
                {
                    foreach (var siteCoreKafka in getsiteCoreKafkaDetails.Split(','))
                    {
                        if (string.IsNullOrWhiteSpace(siteCoreKafka)) continue;
                        var hostName = siteCoreKafka.Split(':')[0].Trim();
                        var port = Convert.ToInt32(siteCoreKafka.Split(':')[1].Trim());
                        TcpClient tc = null;
                        try
                        {
                            using (tc = new TcpClient(hostName, port))
                            {
                                hosts.sitecoreHostConnections.Add(new HostConnection
                                {
                                    ConnectionName = siteCoreKafka,
                                    Connection = tc.Connected
                                });
                            }
                        }
                        catch (Exception e)
                        {
                            hosts.sitecoreHostConnections.Add(new HostConnection
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

            if (string.IsNullOrWhiteSpace(getrtmsKafkaDetails)) return View("HealthDetails", hosts);
            {
                try
                {
                    foreach (var rtmsKafka in getrtmsKafkaDetails.Split(','))
                    {
                        if (string.IsNullOrWhiteSpace(rtmsKafka)) continue;
                        var hostName = rtmsKafka.Split(':')[0].Trim();
                        var port = Convert.ToInt32(rtmsKafka.Split(':')[1].Trim());
                        TcpClient tc = null;
                        try
                        {
                            using (tc = new TcpClient(hostName, port))
                            {
                                hosts.rtmsHostConnections.Add(new HostConnection
                                {
                                    ConnectionName = rtmsKafka,
                                    Connection = tc.Connected
                                });
                            }
                        }
                        catch (Exception e)
                        {
                            _log.LogError(e, e.Message);
                            hosts.rtmsHostConnections.Add(new HostConnection
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
            return View("HealthDetails", hosts);
        }
    }
}