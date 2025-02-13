using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;

namespace Frontend.Gantry.Shared.Core.Models.ViewModels
{
    public class Hosts
    {
        public List<HostConnection> sitecoreHostConnections { get; set; }
        public List<HostConnection> rtmsHostConnections { get; set; }
    }
}