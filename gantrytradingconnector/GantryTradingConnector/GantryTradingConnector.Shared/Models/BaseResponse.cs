using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace GantryTradingConnector.Shared.Models
{
    public class BaseResponse
    {
        public string UrlTradingResponse { get; set; }

        public string RequestedQuery { get; set; }

        public long TCALatency { get; set; }

        public long GTCLatency { get; set; }

        public HttpStatusCode Status { get; set; }
    }
}
