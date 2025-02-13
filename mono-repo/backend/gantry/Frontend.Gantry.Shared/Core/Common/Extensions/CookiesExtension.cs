using Frontend.Gantry.Shared.Core.Common.Constants;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;

namespace Frontend.Gantry.Shared.Core.Common.Extensions
{
    public static class CookiesExtension
    {
        /// <summary>
        /// Extention method to Cookie to add/update to response or remove/expire if doesn't have value.
        /// </summary>
        /// <param name="response">http response.</param>
        /// <param name="key">Cookie name</param>
        /// <param name="value">Cookie value</param>
        /// <param name="regexPatternForCookieValue">Regex for cookies values.</param>
        public static void AddCookie(this HttpContext httpContext, string key, string? value, string regexPatternForCookieValue)
        {
            Regex regexForCookieValue = new Regex(regexPatternForCookieValue);
            if (value != null && regexForCookieValue.IsMatch(value) && ConstantsPropertyValues.CacheKeys.Contains(key))
            {
                httpContext.Response.Cookies.Append(key, value, new CookieOptions() {
                    Secure = true,
                    HttpOnly = true,
                    Path = "/",
                    Domain = httpContext.Request.Host.ToString()
                });
            }
            else
            {
                httpContext.Response.Cookies.Delete(key);
            }
        }
    }
}
