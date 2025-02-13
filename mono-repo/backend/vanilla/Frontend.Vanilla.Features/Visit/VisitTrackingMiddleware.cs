using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Visit;

internal class VisitTrackingMiddleware(
    RequestDelegate next,
    IVisitorSettingsManager settingsManager,
    IClock clock,
    ICookieHandler cookieHandler,
    IEndpointMetadata endpointMetadata)
    : WebAbstractions.Middleware(next)
{
    private const string VnSession = "vnSession";

    public override Task InvokeAsync(HttpContext httpContext)
    {
        if (!endpointMetadata.Contains<ServesHtmlDocumentAttribute>())
            return Next(httpContext);

        var vnSession = cookieHandler.GetValue(VnSession);

        if (!string.IsNullOrEmpty(vnSession)) return Next(httpContext);

        cookieHandler.Set(VnSession, Guid.NewGuid().ToString());

        var settings = settingsManager.Current;
        settingsManager.Current = settings.With(
            visitCount: settings.VisitCount + 1,
            sessionStartTime: clock.UtcNow,
            previousSessionStartTime: settings.SessionStartTime);

        return Next(httpContext);
    }
}
