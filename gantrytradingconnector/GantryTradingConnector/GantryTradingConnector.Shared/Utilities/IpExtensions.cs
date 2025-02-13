using System.Net;
using Microsoft.AspNetCore.Http;

namespace GantryTradingConnector.Shared.Utilities
{
    public static class IpExtensions
    {
        //Gets IP of client , firstly checks the X-Forwarded-For header to check if we are behind load balancer
        public static string GetClientIpAddress(HttpContext context)
        {
            string forwardedForHeader = "X-Forwarded-For";
        
            if (context != null)
            {
                // Check for X-Forwarded-For header to handle Load Balancer scenarios
                if (context.Request.Headers.ContainsKey(forwardedForHeader))
                {
                    string[] forwardedFor = context.Request.Headers[forwardedForHeader]
                        .ToString()
                        .Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

                    if (forwardedFor.Length > 0)
                    {
                        // The first entry should be the client's actual IP
                        return forwardedFor[0].Trim();
                    }
                }

                // If X-Forwarded-For is not available, fallback to Remote IP Address
                if (context.Connection.RemoteIpAddress != null)
                {
                    return context.Connection.RemoteIpAddress.ToString();
                }
            }

            return string.Empty;
        }

    }
}

