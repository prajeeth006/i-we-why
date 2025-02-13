using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.WebUtilities;
using LaunchDarkly.Sdk;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Features.UrlTransformation
{
    internal class UrlTransformationMiddleware(
        RequestDelegate next,
        IUrlTranslator translator,
        ILogger<UrlTransformationMiddleware> logger,
        IUrlTransformationConfiguration config,
        IEndpointMetadata endpointMetadata)
        : WebAbstractions.Middleware(next)
    {
        public override async Task InvokeAsync(HttpContext httpContext)
        {
            if (!endpointMetadata.Contains<ServesHtmlDocumentAttribute>() || !config.IsEnabled)
            {
                await Next(httpContext);
                return;
            }

            try
            {
                var uri = ToUri(httpContext.Request);
                if (uri.IsSportRequest())
                {
                    var path = WebUtility.UrlDecode(uri.PathAndQuery);
                    var translated = translator.Translate(path, GetType().Name, httpContext.RequestAborted);

                    if (!string.Equals(path, translated, StringComparison.OrdinalIgnoreCase))
                    {
                        var redirect = Replace(ForceHttps(uri, config.ForceHttps), path, translated);

                        httpContext.Response.StatusCode = (int)HttpStatusCode.Moved;
                        httpContext.Response.Headers.Append(HttpHeaders.Location, redirect.AbsoluteUri);
                        httpContext.Response.Headers.Append(HttpHeaders.CacheControl, "max-age=28800");
                        httpContext.Response.Headers.Append(HttpHeaders.XRedirectSource, GetType().FullName);

                        return;
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, $"[UrlTransformation] - Error processing {GetType().Name}");
            }

            await Next(httpContext);
        }

        public Uri Replace(Uri uri, string match, string replacement)
        {
            var result = WebUtility.UrlDecode(uri.ToString()).Replace(match, replacement);

            return new UriBuilder(result)
            {
                Port = -1,
            }.Uri;
        }

        public Uri ForceHttps(Uri uri, bool forceHttps)
        {
            if (!forceHttps) return uri;

            return new UriBuilder(uri)
            {
                Scheme = Uri.UriSchemeHttps,
                Port = -1,
            }.Uri;
        }

        public static Uri ToUri(HttpRequest request)
        {
            var hostComponents = request.Host.ToUriComponent().Split(':');

            var builder = new UriBuilder
            {
                Scheme = request.Scheme,
                Host = hostComponents[0],
                Path = request.Path,
                Query = request.QueryString.ToUriComponent(),
            };

            if (hostComponents.Length == 2)
            {
                builder.Port = Convert.ToInt32(hostComponents[1]);
            }

            return builder.Uri;
        }
    }
}
