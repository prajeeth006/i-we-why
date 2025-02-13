using System.Net;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Features.PublicPages;
using Frontend.Vanilla.Features.Routing;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Host.Features.PageNotFound;

internal class PageNotFoundMiddleware(
    RequestDelegate next,
    IEndpointMetadata endpointMetadata,
    IContentService contentService,
    IRequestedContentValidator requestedContentValidator,
    IPublicPagesConfiguration publicPagesConfiguration,
    IPageNotFoundConfiguration pageNotFoundConfiguration,
    ILogger<PageNotFoundMiddleware> log)
    : Middleware(next)
{
    public override Task InvokeAsync(HttpContext httpContext)
    {
        if (endpointMetadata.Contains<ServesNotFoundAttribute>()) // To skip SiteRoot files request.
            return Next(httpContext);

        if (httpContext.Request.RouteValues[RouteValueKeys.Path] is string path)
        {
            if (endpointMetadata.Contains<ServesPublicPagesAttribute>())
            {
                return WritePublicPageResponseAsync(httpContext, endpointMetadata.Get<ServesPublicPagesAttribute>()!.RootPath, path);
            }
            else if (endpointMetadata.Contains<ServesHtmlDocumentAttribute>())
            {
                return WriteDocumentResponseAsync(httpContext);
            }
        }

        return Next(httpContext);
    }

    private async Task WriteDocumentResponseAsync(HttpContext httpContext)
    {
        if (httpContext.Request.Path.HasValue && !pageNotFoundConfiguration.ClientPaths.IsNullOrEmpty())
        {
            var allPaths = Enumerable.SelectMany(pageNotFoundConfiguration.ClientPaths, pair => pair.Value);

            if (!Enumerable.Any(allPaths, path => Regex.IsMatch(httpContext.Request.Path.Value, path, RegexOptions.IgnoreCase)))
            {
                httpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
            }
        }

        await Next(httpContext);
    }

    private async Task WritePublicPageResponseAsync(HttpContext httpContext, string rootPath, string path)
    {
        DocumentId docId = rootPath + path;
        var content = contentService.GetContent<IDocument>(docId, new ContentLoadOptions { PrefetchDepth = publicPagesConfiguration.PrefetchDepth });

        try
        {
            var validationResult = requestedContentValidator.Validate(content);

            switch (validationResult)
            {
                case OkRequestedContentValidationResult _:
                    break;
                case NotFoundRequestedContentValidationResult _:
                    httpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    log.LogWarning("Request for public page with {id} was not found (status = {status}, version = {version})",
                        docId,
                        content.Status.ToString(),
                        content.Metadata?.Version);

                    break;
                case ErrorRequestedContentValidationResult errorResult:
                    httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    log.LogError($"Public page content is invalid because {errorResult.Errors.ToDebugString()}");

                    break;
            }
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Public page with {id} could not be validated due to the following error", docId);
        }

        await Next(httpContext);
    }
}
