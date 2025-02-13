using System.Collections.Generic;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.SessionLimits
{
    /// <summary>Creates a new instance.</summary>
    public sealed class SessionLimitsData
     {
        /// <summary>ActionTaken.</summary>
        public string ActionTaken { get; set; }

        /// <summary>Creates a Limit type string.</summary>
        public List<string> LimitTypes { get; set; }

        /// <summary>Sso of the user.</summary>
        public string EncodedSsoKey { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="SessionLimitsData"/> class.
        /// </summary>
        /// <param name="actionTaken"></param>
        /// <param name="limitTypes"></param>
        /// <param name="encodedSsoKey"></param>
        public SessionLimitsData(string actionTaken, List<string> limitTypes, string encodedSsoKey)
        {
            ActionTaken = actionTaken;
            LimitTypes = limitTypes;
            EncodedSsoKey = encodedSsoKey;
        }
    }
}
