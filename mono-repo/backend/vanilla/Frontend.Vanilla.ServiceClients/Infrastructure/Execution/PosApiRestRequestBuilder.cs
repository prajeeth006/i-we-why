using System;
using System.Linq;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Security;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Execution;

/// <summary>
/// Main Vanilla implementation of <see cref="IPosApiRestRequestBuilder" />.
/// </summary>
internal sealed class PosApiRestRequestBuilder(
    IServiceClientsConfiguration config,
    IClientIPResolver clientIpResolver,
    ICurrentUserAccessor currentUserAccessor)
    : IPosApiRestRequestBuilder
{
    public void PrepareRestRequest(RestRequest restRequest, PosApiRestRequest posApiRequest)
    {
        if (posApiRequest.Content != null)
            restRequest.Content = new RestRequestContent(posApiRequest.Content, PosApiRestClient.Formatter);

        SetCommonHeaders(restRequest.Headers);
        SetPosApiAuthenticationHeaders(restRequest.Headers, posApiRequest);
        SetHeadersFromConfig(restRequest.Headers);
        restRequest.Headers.Add(posApiRequest.Headers, KeyConflictResolution.Overwrite);
        SetAdditionalQueryParameters(restRequest);
        SetTimeout(restRequest);
        SetEndpointVersion(restRequest);
    }

    private void SetCommonHeaders(RestRequestHeaders headers)
    {
        var clientIp = clientIpResolver.Resolve();

        headers[HttpHeaders.Accept] = ContentTypes.Json;
        headers[PosApiHeaders.AccessId] = config.AccessId;
        headers[PosApiHeaders.ClientIP] = clientIp.ToString();
    }

    private void SetPosApiAuthenticationHeaders(RestRequestHeaders headers, PosApiRestRequest posApiRequest)
    {
        if (!posApiRequest.Authenticate)
            return;

        var tokens = currentUserAccessor.User.GetRequiredPosApiAuthTokens();
        headers[PosApiHeaders.UserToken] = tokens.UserToken;
        headers[PosApiHeaders.SessionToken] = tokens.SessionToken;
    }

    private void SetHeadersFromConfig(RestRequestHeaders headers)
    {
        foreach (var header in config.Headers)
            headers[header.Key] = header.Value.ToArray(); // Overwrite previous
    }

    private void SetTimeout(RestRequest restRequest)
    {
        var timeoutRule = config.TimeoutRules.FirstOrDefault(r =>
            (r.Methods.Count == 0 || r.Methods.Contains(restRequest.Method))
            && r.UrlRegex.IsMatch(restRequest.Url.ToString()));

        if (timeoutRule != null)
            restRequest.Timeout = timeoutRule.Timeout;
    }

    private void SetAdditionalQueryParameters(RestRequest restRequest)
    {
        var urlBuilder = new UriBuilder(restRequest.Url);

        foreach (var rule in config.QueryParametersRules)
        {
            if (!Regex.IsMatch(restRequest.Url.ToString(), rule.Key)) continue;

            foreach (var item in rule.Value.Values)
            {
                if (!item.Enabled.Evaluate()) continue;

                foreach (var parameter in item.Parameters)
                {
                    urlBuilder.AddQueryParameters((parameter.Key, parameter.Value));
                }
            }
        }

        restRequest.Url = urlBuilder.GetHttpUri();
    }

    private void SetEndpointVersion(RestRequest restRequest)
    {
        var absoluteUri = restRequest.Url.AbsoluteUri;
        var overrideVersion = config.EndpointsV2.FirstOrDefault(e => e.Key.IsMatch(absoluteUri)).Value?.Version;
        var requestVersion = Regex.Match(absoluteUri, "/(v|V)([1-9]+)/").Value;

        if (!overrideVersion.IsNullOrWhiteSpace() && !requestVersion.IsNullOrWhiteSpace())
        {
            restRequest.Url = new HttpUri(absoluteUri.Replace(requestVersion, $"/{overrideVersion}/"));
        }
    }
}
