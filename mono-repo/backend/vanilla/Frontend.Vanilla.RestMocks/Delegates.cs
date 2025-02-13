#nullable enable

using System;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.Cookies;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.RestMocks;

internal class RestMockDelegateContext(HttpContext? httpContext, ICookieHandler cookieHandler, RestRequest? restRequest)
{
    public HttpContext? HttpContext { get; } = httpContext;
    public HttpRequest? BrowserRequest => HttpContext?.Request;
    public RestRequest RestRequest => restRequest ?? throw new Exception("Not in RestRequest.");

    public string? GetCookie(string name)
    {
        if (HttpContext == null)
        {
            return null;
        }

        return cookieHandler.GetValue(name);
    }
}

/// <summary>
/// Delegate to match HTTP request incoming to this app.
/// </summary>
internal delegate bool MatchIncomingRequestToThisAppHandler(RestMockDelegateContext context);

/// <summary>
/// Delegate to match outgoing REST request made by this app.
/// </summary>
internal delegate bool MatchOutgoingRequestFromThisAppHandler(RestMockDelegateContext context);

/// <summary>
/// Delegate for creating mocked REST response.
/// </summary>
internal delegate RestResponse GetMockedResponseHandler(RestMockDelegateContext context);
