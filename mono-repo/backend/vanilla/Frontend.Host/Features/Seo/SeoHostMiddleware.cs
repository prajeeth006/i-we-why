using Frontend.Host.App.Contracts;
using Frontend.Host.Features.HttpForwarding;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Extensions.Logging;

namespace Frontend.Host.Features.Seo
{
    internal class SeoHostMiddleware(
        IProductApiHttpClient productApiHttpClient,
        IEndpointMetadata endpointMetadata,
        ILanguageService languageService,
        ISeoHostConfiguration config,
        ILogger<SeoHostMiddleware> logger,
        RequestDelegate next) : Middleware(next)
    {
        private const string ErrorMessage = "Error while processing SeoHostMiddleware.";

        public override async Task InvokeAsync(HttpContext httpContext)
        {
            if (!endpointMetadata.Contains<ServesHtmlDocumentAttribute>() || !config.IsEnabled)
            {
                await Next(httpContext);
                return;
            }
            try
            {
                var redirectResponseMetadata = await productApiHttpClient.GetFromJsonAsync<RedirectResponseMetadata>(ProductApi.Sports, $"{languageService.Current.RouteValue}/sports/api/seo/redirect?url={httpContext.Request.GetEncodedUrl()}", httpContext.RequestAborted);

                if (redirectResponseMetadata?.StatusReason is not null)
                {
                    httpContext.Response.StatusCode = redirectResponseMetadata!.StatusCode;
                    httpContext.Response.Headers.Append("Location", redirectResponseMetadata.Location);
                    httpContext.Response.Headers.Append("CacheControl", redirectResponseMetadata.CacheControl);
                    httpContext.Response.Headers.Append("X-Redirect-Source", GetType().FullName);
                    httpContext.Response.Headers.Append("X-Status-Source", redirectResponseMetadata.StatusSource);
                    httpContext.Response.Headers.Append("X-Status-Reason", redirectResponseMetadata.StatusReason);
                    return;
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ErrorMessage);
            }

            await Next(httpContext);
        }
    }
}
