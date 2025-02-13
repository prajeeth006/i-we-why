using System.Threading.Tasks;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.EntryWeb.TopLevelDomainCookies;

internal sealed class TopLevelDomainCookiesCleanupMiddleware(
    RequestDelegate next,
    IEndpointMetadata endpointMetadata,
    ITopLevelDomainCookiesConfiguration config,
    ICookieHandler cookieHandler)
    : WebAbstractions.Middleware(next)
{
    public override Task InvokeAsync(HttpContext httpContext)
    {
        if (endpointMetadata.Contains<ServesHtmlDocumentAttribute>() && config.Cleanup.Cookies.Count > 0)
        {
            var options = new CookieLocationOptions
            {
                Domain = CookieDomain.Special,
                SpecialDomainValue = config.Cleanup?.Domain,
            };

            foreach (var cookieName in config.Cleanup!.Cookies)
            {
                cookieHandler.Delete(cookieName, options);
            }

            httpContext.Response.Headers[HttpHeaders.XCookiesCleanup] = "1";
        }

        return Next(httpContext);
    }
}
