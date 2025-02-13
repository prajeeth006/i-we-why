using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;

namespace Frontend.Gantry.Shared.Core.Attributes
{
    public class GantryApiInterceptorActionFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext actionExecutedContext)
        {
            var actionContext = actionExecutedContext.HttpContext;
            var cookieOptions = new CookieOptions()
            {
                Secure = true,
                HttpOnly = true,
                Path = "/",
                Domain = actionContext.Request.Host.ToString()
            };


            if (actionContext.Request.Headers.TryGetValue("X-ENT-1-TraceId", out var traceId))
            {
                actionContext.Response.Cookies.Append("X-ENT-1-TraceId", traceId.First(), cookieOptions);
            }

            if (actionContext.Request.Headers.TryGetValue("viewGroup", out var viewGroup))
            {
                actionContext.Response.Cookies.Append("viewGroup", viewGroup.First(), cookieOptions);
            }

            if (actionContext.Request.Headers.TryGetValue("viewId", out var viewId))
            {
                actionContext.Response.Cookies.Append("viewId", viewId.First(), cookieOptions);
            }
        }
    }
}