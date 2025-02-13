using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Yarp.ReverseProxy.Forwarder;

namespace Frontend.Host.Features.HttpForwarding;

internal sealed class DefaultHttpForwarderProvider(ILogger<DefaultHttpForwarderProvider> logger, IHttpForwardingConfiguration configuration)
    : IHttpForwarderProvider
{
    public int Order { get; } = 1;
    public string PathPattern { get; } = "/reverse-proxy";

    public string? GetDestinationUrl(HttpContext httpContext)
    {
        if (!httpContext.Request.Query.TryGetValue("url", out var url) || string.IsNullOrWhiteSpace(url))
        {
            return null;
        }

        if (!Uri.TryCreate(url, UriKind.Absolute, out var targetUri))
        {
            logger.LogError("{url} couldn't be parsed.", url.ToString());

            return null;
        }

        if (!configuration.WhitelistedHosts.Any(domain => targetUri.DnsSafeHost.EndsWith(domain.Value)))
        {
            logger.LogWarning("{url} is not whitelisted.", url.ToString());

            return null;
        }

        return url;
    }

    public HttpTransformer Transformer { get; } = HttpForwarder.Transformer.CopyAllRequestHeadersSingleton;
}
