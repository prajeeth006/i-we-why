using System.Linq;
using System.Net;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics;

internal sealed class HttpRequestDiagnosticProvider(IHttpContextAccessor httpContextAccessor) : SyncDiagnosticInfoProvider
{
    public override DiagnosticInfoMetadata Metadata { get; } = new (
        name: "HTTP Request",
        urlPath: "http-request",
        shortDescription: "Shows details how the server receives actual HTTP request.",
        descriptionHtml: "Useful to compare from client side how the request is modified by web server, CDN, network etc.");

    public override object GetDiagnosticInfo()
    {
        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        var httpRequest = httpContext.Request;

        return new
        {
            Headers = httpRequest.Headers.Keys.ToDictionary(h => h, h => httpRequest.Headers[h]),
            Cookies = httpRequest.Cookies.Keys.ToDictionary(c => c, c => httpRequest.Cookies[c]),
            httpRequest.Host,
            httpRequest.Path,
            httpRequest.PathBase,
            httpRequest.QueryString,
            httpContext.Connection,
            IsLocal = IsLocal(httpContext.Connection),
            ServerVariables = new
            {
                HTTP_X_FORWARDED_FOR = httpContext.GetServerVariable("HTTP_X_FORWARDED_FOR "),
            },
        };
    }

    private static bool IsLocal(ConnectionInfo connection)
    {
        if (connection.RemoteIpAddress == null) return false;

        return connection.LocalIpAddress != null ? connection.RemoteIpAddress.Equals(connection.LocalIpAddress) : IPAddress.IsLoopback(connection.RemoteIpAddress);
    }
}
