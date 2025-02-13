using System;
using System.Collections.Generic;
using System.Text;

namespace Frontend.Gantry.Shared.Configuration
{
    public interface IAuthenticationDataFeedConfig
    {
        public Dictionary<string,string> AuthenticationConfig { get; }
        public string AuthenticationKey { get; }
        public string FailedConnectionRetryDelay { get; }
        public string PendingConnectionRetryDelay { get; }
        public string SnapshotRetryDelay { get; }
    }

    public class AuthenticationDataFeedConfig : IAuthenticationDataFeedConfig
    {
        public Dictionary<string, string> AuthenticationConfig { get; set; }
        public string AuthenticationKey { get; set; }
        public string FailedConnectionRetryDelay { get; set; }
        public string PendingConnectionRetryDelay { get; set; }
        public string SnapshotRetryDelay { get; set; }

    }
}
