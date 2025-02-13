using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Login;

internal interface IAutoLoginHandler
{
    IReadOnlyList<TrimmedRequiredString> UsedQueryKeys { get; }
    Task? TryLoginAsync(HttpRequest request, CancellationToken cancellationToken); // Avoid async overhead if possible
}

internal sealed class AutoLoginMiddleware<THandler>(RequestDelegate next, THandler loginHandler, IEndpointMetadata endpointMetadata)
    : WebAbstractions.Middleware(next)
    where THandler : IAutoLoginHandler
{
    private readonly THandler loginHandler = loginHandler;

    // Tries to avoid async overhead if possible b/c executed for each request
    public override Task InvokeAsync(HttpContext httpContext)
    {
        if (!endpointMetadata.Contains<ServesHtmlDocumentAttribute>()
            || httpContext.User.Identity?.IsAuthenticated is true
            || (httpContext.Request.QueryString.IsEmpty() &&
                !httpContext.Request.Headers.ContainsKey(HttpHeaders.Sso) &&
                !httpContext.Request.Cookies.ContainsKey(CookieConstants.SsoTokenCrossDomain)))
        {
            return Next(httpContext);
        }

        var loginTask = loginHandler.TryLoginAsync(httpContext.Request, httpContext.RequestAborted);

        return loginTask != null
            ? ExecuteLoginAsync(loginTask, httpContext)
            : Next(httpContext);
    }

    private async Task ExecuteLoginAsync(Task loginTask, HttpContext httpContext)
    {
        await loginTask;

        var targetUrl = new UriBuilder(httpContext.Request.GetFullUrl())
            .RemoveQueryParameters(loginHandler.UsedQueryKeys.Select(k => k.Value))
            .Uri.PathAndQuery; // Relative to avoid http vs https offloading problem

        httpContext.Response.Redirect(targetUrl, source: this);
    }
}
