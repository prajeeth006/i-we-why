using Frontend.Host.App.Contracts;
using Frontend.Host.Features.HttpForwarding;
using Frontend.Host.Features.UrlTransformation;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Extensions.Logging;
using System.Net;

namespace Frontend.Host.Features.PrettyUrls
{
    internal class PrettyUrlsHostMiddleware(
        IProductApiHttpClient productApiHttpClient,
        IEndpointMetadata endpointMetadata,
        ILanguageService languageService,
        IPrettyUrlsHostConfiguration config,
        RequestDelegate next,
        ILogger<PrettyUrlsHostMiddleware> logger)
        : Middleware(next)
    {
        private const string ErrorMessage = "Error while processing PrettyUrlsHostMiddleware.";

        public override async Task InvokeAsync(HttpContext httpContext)
        {
            if (!endpointMetadata.Contains<ServesHtmlDocumentAttribute>() || !config.IsEnabled)
            {
                await Next(httpContext);
                return;
            }

            try
            {
                var translatedResponseMetadata = await productApiHttpClient.GetFromJsonAsync<RedirectResponseMetadata>(ProductApi.Sports, $"{languageService.Current.RouteValue}/sports/api/translate?url={httpContext.Request.GetEncodedUrl()}", httpContext.RequestAborted);

                if (translatedResponseMetadata?.StatusCode == (int)HttpStatusCode.Moved)
                {
                    httpContext.Response.StatusCode = translatedResponseMetadata!.StatusCode;
                    httpContext.Response.Headers.Append("Location", translatedResponseMetadata.Location);
                    httpContext.Response.Headers.Append("CacheControl", translatedResponseMetadata.CacheControl);
                    httpContext.Response.Headers.Append("X-Redirect-Source", GetType().Name);
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
