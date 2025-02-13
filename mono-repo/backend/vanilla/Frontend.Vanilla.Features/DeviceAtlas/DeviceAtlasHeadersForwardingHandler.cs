using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Rest;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.DeviceAtlas;

internal sealed class DeviceAtlasHeadersForwardingHandler : DelegatingHandler
{
    private readonly IHttpContextAccessor httpContextAccessor;
    private readonly IDeviceAtlasHeadersFilter deviceAtlasHeadersFilter;

    public DeviceAtlasHeadersForwardingHandler(IHttpContextAccessor httpContextAccessor, IDeviceAtlasHeadersFilter deviceAtlasHeadersFilter)
    {
        this.httpContextAccessor = httpContextAccessor;
        this.deviceAtlasHeadersFilter = deviceAtlasHeadersFilter;
    }

    protected override HttpResponseMessage Send(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var currentContext = httpContextAccessor.HttpContext;

        if (currentContext is not null)
        {
            foreach (var header in deviceAtlasHeadersFilter.Filter(currentContext.Request.Headers))
            {
                request.Headers.AddIfNoNewlines(header.Key, header.Value.ToString());
            }

            currentContext.Request.Cookies.TryGetValue(DeviceCapabilitiesDiagnosticProvider.CookieName, out var daprops);
            if (!string.IsNullOrWhiteSpace(daprops))
            {
                request.Headers.AddIfNoNewlines("x-daprops", daprops);
            }
        }

        return base.Send(request, cancellationToken);
    }

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var currentContext = httpContextAccessor.HttpContext;

        if (currentContext is not null)
        {
            foreach (var header in deviceAtlasHeadersFilter.Filter(currentContext.Request.Headers))
            {
                request.Headers.AddIfNoNewlines(header.Key, header.Value.ToString());
            }

            currentContext.Request.Cookies.TryGetValue(DeviceCapabilitiesDiagnosticProvider.CookieName, out var daprops);
            if (!string.IsNullOrWhiteSpace(daprops))
            {
                request.Headers.AddIfNoNewlines("x-daprops", daprops);
            }
        }

        return await base.SendAsync(request, cancellationToken);
    }
}
