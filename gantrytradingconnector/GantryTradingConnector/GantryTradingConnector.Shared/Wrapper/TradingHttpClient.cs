using System.Net.Http;
using System.Net;
using GantryTradingConnector.Shared.Services;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Text;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using GantryTradingConnector.Shared.Models;

namespace GantryTradingConnector.Shared.Wrapper
{
    public class TradingHttpClient : HttpClient, ITradingHttpClient
    {
        private readonly ILogger<TradingHttpClient> _logger;
        public TradingHttpClient(ILogger<TradingHttpClient> logger)
        {
            _logger = logger;
        }
        public async Task<HttpResponseMessage> GetRequestAsync(string requestUri)
        {
            Stopwatch timer = new Stopwatch();

            HttpClient httpClient;

            using (httpClient = new HttpClient())
            {
                timer.Start();

                HttpResponseMessage httpResponseMessage = new HttpResponseMessage();

                if (!string.IsNullOrEmpty(requestUri))
                {
                    bool isValidUrl = Uri.TryCreate(requestUri, UriKind.Absolute, out Uri? uriResult)
                                      && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
                    if (isValidUrl)
                    {
                        httpResponseMessage = await httpClient.GetAsync(uriResult);
                    }
                }

                timer.Stop();

                var responseTimeForCompleteRequest = timer.ElapsedMilliseconds;

                LogResponse logResponse = new LogResponse
                {
                    RequestUri = httpResponseMessage?.RequestMessage?.RequestUri?.ToString(),
                    Response = httpResponseMessage,
                    Latency = responseTimeForCompleteRequest
                };

                _logger.LogInformation(JsonConvert.SerializeObject(logResponse));

                return httpResponseMessage;
            }
        }
    }
}
