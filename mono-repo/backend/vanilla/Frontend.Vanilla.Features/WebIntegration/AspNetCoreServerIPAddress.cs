using System.Net;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.ServerUtils;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;

namespace Frontend.Vanilla.Features.WebIntegration;

internal sealed class AspNetCoreServerIpAddress(IHttpContextAccessor httpContextAccessor) : IServerIPProvider
{
    public IPAddress? IPAddress
    {
        get
        {
            var httpContext = httpContextAccessor.GetRequiredHttpContext();
            var connection = httpContext.Features.Get<IHttpConnectionFeature>();

            return connection?.LocalIpAddress;
        }
    }
}
