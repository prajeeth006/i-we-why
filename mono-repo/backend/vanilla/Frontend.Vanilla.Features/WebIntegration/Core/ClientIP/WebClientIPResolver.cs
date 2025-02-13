using System.Collections.Generic;
using System.Linq;
using System.Net;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebIntegration.Core.DynaconAppBoot;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.WebIntegration.Core.ClientIP;

/// <summary>
/// Integrates all client IP resolution logic.
/// </summary>
internal sealed class WebClientIpResolver(
    IHttpContextAccessor httpContextAccessor,
    IClientIpResolutionAlgorithm clientIpResolutionAlgorithm,
    IIsInternalRequestAlgorithm isInternalRequestAlgorithm,
    IDynaconAppBootRestClientService dynaconAppBootRestClientService)
    : SyncDiagnosticInfoProvider, IClientIPResolver, IInternalRequestEvaluator
{
    public IPAddress Resolve()
    {
        var details = ResolveCachedDetails();

        return details.ClientIP;
    }

    public bool IsInternal()
    {
        var details = ResolveCachedDetails();

        return details.IsInternalRequest;
    }

    private (IPAddress ClientIP, bool IsInternalRequest) ResolveCachedDetails()
    {
        var httpContext = httpContextAccessor.HttpContext;

        return httpContext?.GetOrAddScopedValue("Van:ClientIP", _ => ResolveFreshDetails(httpContext))
               ?? (IPAddress.Loopback, false);
    }

    private (IPAddress ClientIP, bool IsInternalRequest) ResolveFreshDetails(HttpContext httpContext, ICollection<string>? trace = null)
    {
        var xForwardedForHeader = httpContext.Request.Headers[HttpHeaders.XForwardedFor];
        var clientIp = clientIpResolutionAlgorithm.Resolve(httpContext.Connection.RemoteIpAddress!, xForwardedForHeader, dynaconAppBootRestClientService.GetSubnets(), trace);
        var isInternalRequest = isInternalRequestAlgorithm.Resolve(httpContext, clientIp, trace);

        return (clientIp, isInternalRequest);
    }

    public override DiagnosticInfoMetadata Metadata { get; } = new (
        name: "Client IP Address Resolution",
        urlPath: "clientip",
        shortDescription: "Documentation and detailed trace of client IP address resolution.",
        descriptionHtml: ClientIpResolutionAlgorithm.DocumentationHtml + IsInternalRequestAlgorithm.DocumentationHtml +
                         "<p>Trace of resolution for current request:</p>");

    public override object GetDiagnosticInfo()
    {
        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        var trace = new List<string>();

        var details = ResolveFreshDetails(httpContext, trace);
        trace.Add($"ClientIP = '{details.ClientIP}', IsInternalRequest = {details.IsInternalRequest}.");

        return trace;
    }
}
