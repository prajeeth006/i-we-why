using Microsoft.AspNetCore.Http;
using Yarp.ReverseProxy.Forwarder;

namespace Frontend.Host.Features.HttpForwarding;

internal sealed class CopyAllRequestHeadersTransformer(
    Dictionary<string, IEnumerable<string>>? additionalHeaders = null)
    : HttpTransformer
{
    public override async ValueTask TransformRequestAsync(HttpContext httpContext, HttpRequestMessage proxyRequest, string destinationPrefix, CancellationToken cancellationToken)
    {
        // Copy all request headers
        await base.TransformRequestAsync(httpContext, proxyRequest, destinationPrefix, cancellationToken);
        if (additionalHeaders is not null)
        {
            foreach (var header in additionalHeaders)
            {
                proxyRequest.Headers.Add(header.Key, header.Value);
            }
        }

        proxyRequest.RequestUri = new Uri(destinationPrefix);

        // Suppress the original request header, use the one from the destination Uri.
        proxyRequest.Headers.Host = null;
    }
}
