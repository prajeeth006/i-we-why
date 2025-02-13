using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Yarp.ReverseProxy.Forwarder;

namespace Frontend.Host.Features.HttpForwarding;

internal static class HttpForwardingEndpointRouteBuilder
{
    public static void MapHostHttpForwarding(this IEndpointRouteBuilder endpoints)
    {
        var providers = endpoints.ServiceProvider.GetRequiredService<IEnumerable<IHttpForwarderProvider>>();
        var forwarder = endpoints.ServiceProvider.GetRequiredService<IHttpForwarder>();
        var logger = endpoints.ServiceProvider.GetRequiredService<ILogger<IHttpForwarder>>();

        foreach (var provider in providers.OrderBy(p => p.Order))
        {
            endpoints.Map(provider.PathPattern, async ctx =>
            {
                var url = provider.GetDestinationUrl(ctx);
                if (url is null)
                {
                    logger.LogWarning("Http forwarding provider on {path} wasn't able to determine forwarding url.",
                        provider.PathPattern);
                    return;
                }

                var error = await forwarder.SendAsync(ctx, url, HttpForwarder.MessageInvoker.Singleton, HttpForwarder.RequestConfig.Singleton, provider.Transformer);
                if (error == ForwarderError.None)
                {
                    return;
                }

                var errorFeature = ctx.GetForwarderErrorFeature();
                logger.LogError(errorFeature?.Exception, "{url} forwarding failed with following {error}.", url, errorFeature?.Error ?? error);
                ctx.Response.StatusCode = StatusCodes.Status502BadGateway;
            });
        }
    }
}
