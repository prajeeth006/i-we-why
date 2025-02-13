using System;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using Frontend.Vanilla.Features.AntiForgery;
using Frontend.Vanilla.Features.Authentication;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Features.AntiForgeryProtection;

internal interface IWebApiAntiForgeryFilter : IAuthorizationFilter { }

internal class WebApiAntiForgeryFilter(IAntiForgeryToken antiForgeryToken, IAuthenticationConfiguration authenticationConfig, ILogger<WebApiAntiForgeryFilter> log)
    : IWebApiAntiForgeryFilter
{
    private const string HeaderName = "X-XSRF-TOKEN";
    private static readonly string[] Methods = [ HttpMethod.Get.Method, HttpMethod.Head.Method, HttpMethod.Options.Method ];

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        if (ShouldBypassAntiForgery(context))
            return;

        var serverToken = antiForgeryToken.GetValue();

        if (string.IsNullOrWhiteSpace(serverToken))
            return;

        var clientTokens = context.HttpContext.Request.Headers.TryGetValue(HeaderName, out var clientValues)
            ? clientValues
            : StringValues.Empty;

        if (clientTokens.Count != 1 || clientTokens[0] != serverToken)
        {
            log.LogWarning("Failed anti-forgery validation of {clientToken} vs. expected {serverToken}", clientTokens, serverToken);

            throw new AntiForgeryValidationException();
        }
    }

    private bool ShouldBypassAntiForgery(AuthorizationFilterContext context)
    {
        return Methods.Any(x => x == context.HttpContext.Request.Method)
               || !authenticationConfig.IsAntiForgeryValidationEnabled
               || ((context.ActionDescriptor as ControllerActionDescriptor)!).ControllerTypeInfo
               .GetCustomAttributes<BypassAntiForgeryTokenAttribute>().Any()
               || ((context.ActionDescriptor as ControllerActionDescriptor)!).MethodInfo
               .GetCustomAttributes<BypassAntiForgeryTokenAttribute>().Any();
    }
}

internal sealed class AntiForgeryValidationException : Exception { }
