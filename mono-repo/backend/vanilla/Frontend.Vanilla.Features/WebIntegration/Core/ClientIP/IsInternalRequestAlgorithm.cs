using System.Collections.Generic;
using System.Net;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Cookies;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.WebIntegration.Core.ClientIP;

/// <summary>
/// Evaluates if given request is internal which means it comes from the company network hences some internal features can be allowed.
/// </summary>
internal interface IIsInternalRequestAlgorithm
{
    bool Resolve(HttpContext httpContext, IPAddress clientIp, ICollection<string>? trace);
}

internal sealed class IsInternalRequestAlgorithm(IEnvironmentProvider envProvider, ICookieHandler cookieHandler) : IIsInternalRequestAlgorithm
{
    public static readonly string DocumentationHtml = string.Concat(
        $"<p>If you need to expose/enable some feature only for company employees within the company network then you can leverage <em>{typeof(IInternalRequestEvaluator)}</em>.",
        " Use it with caution, mainly for diagnostic pages/features because there is a danger that the feature would seem to be fine from company network",
        " but it would fail publicly for our customers and developers wouldn't realize it.</p>",
        "<p>It considers request to be internal if:</p>",
        "<ul>",
        "<li>Resolved client IP address is private which means it comes from company network.</li>",
        "<li>The app is running in non-production environment.</li>",
        "<li>The request comes from local machine where the app is hosted.</li>",
        $"<li>In order to test from company network how the app behaves for external users you can opt out by adding a cookie <em>{ExternalRequestCookie}</em> with value <em>true</em>.</li>",
        "</ul>");

    public const string ExternalRequestCookie = "ExternalRequest";

    public bool Resolve(HttpContext httpContext, IPAddress clientIp, ICollection<string>? trace)
    {
        var externalRequestCookieValue = cookieHandler.GetValue(ExternalRequestCookie);
        trace?.Add(
            "Evaluating if the request is internal based on"
            + $" its physical IP address '{httpContext.Connection.RemoteIpAddress}',"
            + $" its IsLocal flag with value {httpContext.Connection.RemoteIpAddress?.IsLocal()} according to ASP.NET,"
            + $" resolved client IP address '{clientIp}' which is {(clientIp.IsPrivate() ? "private" : "public")},"
            + $" cookie 'ExternalRequest' which is {externalRequestCookieValue.Dump()},"
            + $" environment which is '{envProvider.Environment}'.");

        if (externalRequestCookieValue?.EqualsIgnoreCase("true") == true)
            return WithTrace(false, "the cookie is True");

        if (!envProvider.IsProduction && !envProvider.Environment.EqualsIgnoreCase("beta"))
            return WithTrace(true, "the environment isn't production or beta");

        if (httpContext.Connection.RemoteIpAddress!.IsLocal())
            return WithTrace(true, "the request is local");

        return clientIp.IsPrivate() ? WithTrace(true, "client IP is private") : WithTrace(false, "client IP is public");

        bool WithTrace(bool isInternal, string reason)
        {
            trace?.Add($"Returning {isInternal} meaning the request is {(isInternal ? "internal" : "external")} because {reason}.");

            return isInternal;
        }
    }
}
