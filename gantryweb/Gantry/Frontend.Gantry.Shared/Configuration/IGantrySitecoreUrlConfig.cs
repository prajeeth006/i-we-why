using System;
using System.Collections.Generic;
using System.Text;

namespace Frontend.Gantry.Shared.Configuration
{
    public interface IGantrySitecoreUrlConfig
    {
        string SiteCoreBaseUrl { get; }
        string GetProfileForPresenceMessage { get; }
    }

    public class GantrySitecoreUrlConfig : IGantrySitecoreUrlConfig
    {
        public string SiteCoreBaseUrl { get; set; }
        public string GetProfileForPresenceMessage { get; set; }
    }

}
