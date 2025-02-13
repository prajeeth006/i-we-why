#nullable disable

using System;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Claims;
using Microsoft.AspNetCore.Http;
using Serilog.Core;
using Serilog.Events;

namespace Frontend.Vanilla.Features.Logging.Enrichers;

internal sealed class HttpContextLogEnricher(
    IHttpContextAccessor httpContextAccessor,
    IClientIPResolver clientIpResolver,
    ICookieHandler cookieHandler,
    IEnvironmentProvider environmentProvider)
    : ILogEventEnricher
{
    public const string EvasionDomainHeader = "X-Evasion-Domain";

    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory _)
    {
        var httpContext = httpContextAccessor.HttpContext;

        if (httpContext == null) return;

        logEvent.SetProperty(LogEventProperties.HttpHostname, httpContext.Request.Host.ToString());
        logEvent.SetProperty(LogEventProperties.HttpAbsolutePath, httpContext.Request.GetAbsolutePath());
        logEvent.SetProperty(LogEventProperties.HttpQuery, httpContext.Request.QueryString.Value);
        logEvent.SetProperty(LogEventProperties.Domain, environmentProvider.CurrentLabel);
        logEvent.SetProperty(LogEventProperties.HttpMethod, httpContext.Request.Method);
        logEvent.SetProperty(LogEventProperties.HttpReferrer, httpContext.Request.Headers.GetValue(HttpHeaders.Referer));
        logEvent.SetProperty(LogEventProperties.HttpUserAgent, httpContext.Request.Headers.GetValue(HttpHeaders.UserAgent));
        logEvent.SetProperty(LogEventProperties.EvasionDomain, httpContext.Request.Headers.GetValue(EvasionDomainHeader));

        var clientIp = clientIpResolver.Resolve();
        logEvent.SetProperty(LogEventProperties.HttpClientIP, clientIp.ToString());

        var nativeAppCookieValue = cookieHandler.GetValue(CookieConstants.NativeApp);
        logEvent.SetProperty(LogEventProperties.NativeApp, nativeAppCookieValue);

        var shopId = cookieHandler.GetValue(CookieConstants.ShopId);
        var terminalId = cookieHandler.GetValue(CookieConstants.TerminalId);
        logEvent.SetProperty(LogEventProperties.ShopId, shopId);
        logEvent.SetProperty(LogEventProperties.TerminalId, terminalId);

        var user = ResolveUserDetails(httpContext);
        logEvent.SetProperty(LogEventProperties.UserName, user.Name);
        logEvent.SetProperty(LogEventProperties.UserIsAuthenticated, user.IsAuthenticated);
        logEvent.SetProperty(LogEventProperties.UserWorkflowType, user.WorkflowId);
    }

    private static (string Name, bool IsAuthenticated, string WorkflowId) ResolveUserDetails(HttpContext httpContext)
    {
        try // Just in cae if something fails e.g. cast from IPrincipal to ClaimsPrincipal in legacy ASP.NET
        {
            var user = httpContext.User;
            var isAuthenticated = user.Identity?.IsAuthenticated == true;
            var workflowId = user.FindFirst(PosApiClaimTypes.WorkflowTypeId)?.Value;

            return (user.Identity?.Name, isAuthenticated, workflowId);
        }
        catch (Exception ex)
        {
            var name = "Error: " + ex.GetMessageIncludingInner();

            return (name, false, null);
        }
    }
}
