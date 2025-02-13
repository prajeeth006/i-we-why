using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.PlaceholderReplacers;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.ServiceClients.Claims;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Middleware;

internal sealed class WorkflowIdMiddleware(
    RequestDelegate next,
    IEndpointMetadata endpointMetadata,
    ILoginService loginService,
    IProductPlaceholderReplacer productPlaceholderReplacer)
    : WebAbstractions.Middleware(next)
{
    // Avoids async overhead if possible
    public override Task InvokeAsync(HttpContext httpContext)
    {
        if (!endpointMetadata.Contains<ServesHtmlDocumentAttribute>())
            return Next(httpContext);

        var workflowId = httpContext.User.GetWorkflowTypeId();

        if (workflowId == 0)
            return Next(httpContext);

        var requestPath = httpContext.Request.GetAbsolutePath().ToString();

        return loginService.IsInWorkflowUrlWhiteList(requestPath) ? Next(httpContext) : EvaluateRedirectAsync();

        async Task EvaluateRedirectAsync()
        {
            var redirect = await loginService.GetNextPostLoginRedirectAsync(ExecutionMode.Async(httpContext.RequestAborted));

            if (redirect.Key == null)
            {
                await Next(httpContext);

                return;
            }

            var redirectUrl = await productPlaceholderReplacer.ReplaceAsync(ExecutionMode.Async(httpContext.RequestAborted), redirect.Value.Url);

            if (redirectUrl == null || new Uri(redirectUrl).AbsolutePath.EqualsIgnoreCase(requestPath))
            {
                await Next(httpContext);

                return;
            }

            httpContext.Response.Redirect(redirectUrl, source: redirect.Key);
        }
    }
}
