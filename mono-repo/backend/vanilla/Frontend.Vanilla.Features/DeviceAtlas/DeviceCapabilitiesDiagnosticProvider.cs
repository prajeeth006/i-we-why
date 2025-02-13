using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.DeviceAtlas;

internal sealed class DeviceCapabilitiesDiagnosticProvider(
    IHttpContextAccessor httpContextAccessor,
    IDeviceAtlasService deviceAtlasService,
    ICookieHandler cookieHandler)
    : IDiagnosticInfoProvider
{
    public const string CookieName = "DAPROPS";
    public DiagnosticInfoMetadata Metadata { get; } = new (
        name: "Device Capabilities",
        urlPath: "device",
        shortDescription: "Shows device capabilities resolved by DeviceAtlas.",
        descriptionHtml: @"<p>See <a href=""https://deviceatlas.com/device-data/properties"">official DeviceAtlas properties</a>."
                         + " DeviceAtlas algorithm is examining HTTP request headers, mainly <em>User-Agent</em>."
                         + $" There is a client-side component to it which adds additional details. They are passed using <em>{CookieName}</em> cookie."
                         + " Data is served from DeviceAtlas microservice.</p>");

    public async Task<object> GetDiagnosticInfoAsync(CancellationToken cancellationToken)
    {
        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        var headers = httpContext.Request.Headers;
        var cookie = cookieHandler.GetValue(CookieName);
        var details = await deviceAtlasService.GetAsync(ExecutionMode.Async(cancellationToken));

        return new
        {
            ParametersFromHttpRequest = new Dictionary<string, object?>
            {
                { $"{HttpHeaders.UserAgent} header", headers[HttpHeaders.UserAgent] },
                { $"{CookieName} cookie with client-side properties", cookie },
                { $"{HttpHeaders.AcceptLanguage} header", headers[HttpHeaders.AcceptLanguage] },
            },
            ResponseFromDeviceAtlas = details,
        };
    }
}
