using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Models
{
    public class VersionResponse
    {
        public string Name { get; set; } = "GantryTradingConnector";
        public string? Version { get; set; } 

    }
}
