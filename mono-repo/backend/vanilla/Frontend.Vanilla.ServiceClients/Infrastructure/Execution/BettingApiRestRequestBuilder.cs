using System;
using System.Linq;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Execution;

internal sealed class BettingApiRestRequestBuilder(
    IBettingServiceClientsConfiguration bettingServiceClientsConfiguration,
    IServiceClientsConfiguration serviceClientsConfiguration)
    : IPosApiRestRequestBuilder
{
    public void PrepareRestRequest(RestRequest restRequest, PosApiRestRequest posApiRequest)
    {
        if (posApiRequest is BettingApiRestRequest)
        {
            restRequest.Url = new UriBuilder(bettingServiceClientsConfiguration.Host)
                .AppendPathSegment(bettingServiceClientsConfiguration.Version)
                .AppendTrailingSlash()
                .CombineWith(posApiRequest.Url)
                .GetHttpUri();

            SetTimeout(restRequest);
        }
    }

    private void SetTimeout(RestRequest restRequest)
    {
        var timeoutRule = serviceClientsConfiguration.TimeoutRules?.FirstOrDefault(r =>
            (r.Methods.Count == 0 || r.Methods.Contains(restRequest.Method))
            && r.UrlRegex.IsMatch(restRequest.Url.ToString()));

        if (timeoutRule != null)
            restRequest.Timeout = timeoutRule.Timeout;
    }
}
