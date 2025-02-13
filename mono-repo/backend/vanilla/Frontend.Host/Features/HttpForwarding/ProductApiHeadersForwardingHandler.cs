using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.LabelResolution;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.HttpForwarding;

internal sealed class ProductApiHeadersForwardingHandler(IHttpContextAccessor httpContextAccessor) : DelegatingHandler
{
    private readonly IHttpContextAccessor httpContextAccessor = httpContextAccessor;

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var currentContext = httpContextAccessor.HttpContext;

        if (currentContext is not null)
        {
            foreach (var header in currentContext.Request.Headers)
            {
                if (currentContext.Request.Headers.TryGetValue(HttpHeaders.AcceptEncoding, out var value))
                    continue;
                request.Headers.AddIfNoNewlines(header.Key, header.Value.ToString());
            }

            // add x-label
            var environmentProvider = currentContext.RequestServices.GetRequiredService<IEnvironmentProvider>();
            request.Headers.Add(LabelResolver.LabelRequestHeader, environmentProvider.CurrentLabel);
        }

        return await base.SendAsync(request, cancellationToken);
    }
}
