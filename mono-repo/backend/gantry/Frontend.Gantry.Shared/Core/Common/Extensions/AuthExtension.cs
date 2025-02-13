using Frontend.Gantry.Shared.Configuration;
using Frontend.Vanilla.Core.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Frontend.Gantry.Shared.Core.Common.Extensions
{
    public static class AuthExtension
    {
        /// <summary>
        /// retrive header detail from the request and validate Authentication
        /// </summary>
        /// <param name="actionContext">Context</param>
        /// <param name="authConfuguration">Dynacon auth config</param>
        /// <param name="_internalRequestEvaluator">Internal Request Evaluator object to check internal request or not</param>
        /// <returns></returns>
        public static bool ValidateAuthHeader(this AuthorizationFilterContext actionContext, IGantryAuthenticationConfiguration authConfuguration, IInternalRequestEvaluator _internalRequestEvaluator, string key)
        {
            if (authConfuguration.EnableAuthentication && !_internalRequestEvaluator.IsInternal())
            {
                var authToken = actionContext.HttpContext.Request.Headers[key];
                if(authToken != authConfuguration.AuthenticationKey)
                {
                    return false;
                } else
                {
                    actionContext.HttpContext.AddCookie(key, authToken, authConfuguration.RegexForCookieValue);
                }
            }
            return true;
        }
        public static bool ValidateAuthCookie(this AuthorizationFilterContext actionContext, IGantryAuthenticationConfiguration authConfuguration, IInternalRequestEvaluator _internalRequestEvaluator, string key)
        {
            if (authConfuguration.EnableAuthentication && !_internalRequestEvaluator.IsInternal())
            {
                var authToken = actionContext.HttpContext.Request.Cookies[key];
                if (authToken != authConfuguration.AuthenticationKey)
                {
                    return false;
                }
            }
            return true;
        }
    }
}