using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;

namespace Frontend.Host.Features.HttpForwarding;

internal sealed class ProductApiEagerClientConfigHeadersForwardingHandler(IDynaConParameterExtractor dynaConParameterExtractor, IHttpContextAccessor httpContextAccessor) : DelegatingHandler
{
    private readonly IHttpContextAccessor httpContextAccessor = httpContextAccessor;

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        request.Headers.Add(HttpHeaders.XFromProduct, dynaConParameterExtractor.Product);
        request.Headers.Add(HttpHeaders.XAppContext, "default");

        var currentContext = httpContextAccessor.HttpContext;
        if (currentContext is null)
        {
            return await base.SendAsync(request, cancellationToken);
        }

        request.Headers.Add(HttpHeaders.XBrowserUrl, currentContext.Request.GetDisplayUrl());
        if (currentContext.Request.Headers.TryGetValue(HttpHeaders.Referer, out var referer))
        {
            request.Headers.Add(HttpHeaders.XBrowserReferrer, (IEnumerable<string>)referer);
        }

        return await base.SendAsync(request, cancellationToken);
    }
}
