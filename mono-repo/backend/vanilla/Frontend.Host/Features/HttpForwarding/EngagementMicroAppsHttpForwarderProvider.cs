using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.LabelResolution;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Yarp.ReverseProxy.Forwarder;

namespace Frontend.Host.Features.HttpForwarding;

internal sealed class EngagementMicroAppsHttpForwarderProvider(IEnvironmentProvider environmentProvider, IProductApiHttpClient productApiHttpClient) : IHttpForwarderProvider
{
    public int Order => 2;
    public string PathPattern => "/{culture}/engage/lan/{**catchall}";

    public string GetDestinationUrl(HttpContext httpContext)
    {
        var engagementUri = productApiHttpClient.GetUri(ProductApi.Engagement);

        return new Uri(engagementUri, httpContext.Request.GetEncodedPathAndQuery()).ToString();
    }

    public HttpTransformer Transformer => new CopyAllRequestHeadersTransformer(new Dictionary<string, IEnumerable<string>>
        { [LabelResolver.LabelRequestHeader] = [environmentProvider.CurrentLabel] });
}
