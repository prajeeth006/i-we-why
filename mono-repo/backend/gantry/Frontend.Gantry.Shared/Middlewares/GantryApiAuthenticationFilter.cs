using Frontend.Gantry.Shared.Configuration;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using Frontend.Gantry.Shared.Core.Common.Extensions;
using Frontend.Vanilla.Core.Net;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace Frontend.Gantry.Shared.Middlewares
{
    [AttributeUsage(AttributeTargets.Class)]
    public class GantryApiAuthenticationFilter : Attribute, IAuthorizationFilter
    {
        public IGantryAuthenticationConfiguration _authConfuguration { get; set; }
        public IInternalRequestEvaluator _internalRequestEvaluator { get; set; }

        private static readonly ILoggerFactory _loggerFactory = new LoggerFactory();
        private static readonly ILogger _logger = new Logger<GantryApiAuthenticationFilter>(_loggerFactory);

        public void OnAuthorization(AuthorizationFilterContext filterContext)
        {
            try
            {
                _authConfuguration = filterContext.HttpContext.RequestServices.GetRequiredService<IGantryAuthenticationConfiguration>();
                _internalRequestEvaluator = filterContext.HttpContext.RequestServices.GetRequiredService<IInternalRequestEvaluator>();

                if (!filterContext.ValidateAuthCookie(_authConfuguration, _internalRequestEvaluator, "X-ENT-1-G-Access-Token"))
                {
                    filterContext.Result = new UnauthorizedResult();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,"Unexpected handled error");
            }
        }
    }
}
