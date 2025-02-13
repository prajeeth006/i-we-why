using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Yarp.ReverseProxy.Forwarder;

namespace Frontend.Host.Features.HttpForwarding;

internal sealed class ProductApiProxyMiddleware : Middleware
{
    public const string EnableHeader = "x-product-api-proxy";
    public const string ProductApiPathInfix = "/api/";
    private readonly IHttpForwarder forwarder;
    private readonly ILogger<ProductApiProxyMiddleware> logger;

    public ProductApiProxyMiddleware(RequestDelegate next, IHttpForwarder forwarder, ILogger<ProductApiProxyMiddleware> logger)
        : base(next)
    {
        this.forwarder = forwarder;
        this.logger = logger;
    }
    public override async Task InvokeAsync(HttpContext context)
    {
        var headers = context.Request.Headers;
        var productApiHeaders = headers.Where(h => ProductApiHeaders.All.ContainsValue(h.Key)).ToList();
        switch (productApiHeaders.Count)
        {
            case 0:
                await Next(context);
                return;
            case > 1:
                throw new Exception(
                    $"{nameof(ProductApiProxyMiddleware)} found {productApiHeaders.Count} product api header(s). This is unsupported scenario.");
        }

        var productApiRequestHeader = productApiHeaders.First().Key;
        var productId = ProductApiHeaders.ExtractProductIdFromHeader(productApiRequestHeader);
        var productProxyHeaderName = $"x-product-api-proxy-{productId}";
        var productProxyHeader = headers.FirstOrDefault(h => h.Key.EqualsIgnoreCase(productProxyHeaderName));
        if (productProxyHeader.Key is null)
        {
            logger.LogWarning("You opted in product API proxy using request {enablementHeader} and {productApiRequestHeader}, but failed to provide destination url using request header: {productProxyHeaderName}. This request will not be handled by product API proxy middleware.", EnableHeader, productApiRequestHeader, productProxyHeaderName);
            await Next(context);
            return;
        }

        var destinationHost = productProxyHeader.Value.ToString();
        var destinationUrl = new HttpUri(context.Request.Scheme + "://" + destinationHost +
                                         context.Request.PathBase + context.Request.Path + context.Request.QueryString).ToString();

        var error = await forwarder.SendAsync(context, destinationUrl, HttpForwarder.MessageInvoker.Singleton, HttpForwarder.RequestConfig.Singleton, HttpForwarder.Transformer.CopyAllRequestHeadersSingleton);
        if (error == ForwarderError.None)
        {
            return;
        }

        var errorFeature = context.GetForwarderErrorFeature();
        logger.LogError(errorFeature?.Exception, "Failed to forward product api request for {product} to {url} with {error}.", productId, destinationUrl, errorFeature?.Error ?? error);
        context.Response.StatusCode = 502;
    }
}
