using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.ServiceClients.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Claims;

internal sealed class ClaimRedirectMiddleware(RequestDelegate next, IEndpointMetadata endpointMetadata, ILogger<ClaimRedirectMiddleware> log)
    : WebAbstractions.Middleware(next)
{
    public override Task InvokeAsync(HttpContext httpContext)
    {
        if (!endpointMetadata.Contains<ServesHtmlDocumentAttribute>())
            return Next(httpContext);

        var claimValue = httpContext.User.FindValue(PosApiClaimTypes.Redirect);

        if (claimValue != null)
        {
            if (Uri.TryCreate(claimValue, UriKind.Absolute, out var redirectUrl))
            {
                httpContext.Response.Redirect(redirectUrl.ToString(), source: this);

                return Task.CompletedTask;
            }

            log.LogError("Redirect {claimType} exists but it's {claimValue} isn't an absolute URL so no redirect happens", PosApiClaimTypes.Redirect, claimValue);
        }

        return Next(httpContext);
    }
}
