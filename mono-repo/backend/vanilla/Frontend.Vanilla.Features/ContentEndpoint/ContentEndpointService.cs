#nullable disable
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.PublicPages;
using Frontend.Vanilla.ServiceClients.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Frontend.Vanilla.Features.ContentEndpoint;

internal abstract class ContentEndpointResult { }

internal sealed class UnauthorizedContentEndpointResult : ContentEndpointResult { }

internal sealed class NotAllowedContentEndpointResult : ContentEndpointResult { }

internal sealed class OkContentEndpointResult(ClientDocument document) : ContentEndpointResult
{
    public ClientDocument Document { get; } = document;
}

internal sealed class NotFoundContentEndpointResult : ContentEndpointResult { }

internal interface IContentEndpointService
{
    Task<ContentEndpointResult> FetchContent(string path, bool filterOnClient, CancellationToken cancellationToken);
}

internal sealed class ContentEndpointService(
    IOptions<ContentEndpointOptions> contentEndpointOptions,
    IPublicPagesConfiguration publicPagesConfiguration,
    IAuthorizationConfiguration authorizationConfiguration,
    ICurrentUserAccessor currentUserAccessor,
    IContentService contentService,
    IRequestedContentValidator requestedContentValidator,
    ILogger<ContentEndpointService> log)
    : IContentEndpointService
{
    public async Task<ContentEndpointResult> FetchContent(string path, bool filterOnClient, CancellationToken cancellationToken)
    {
        if (authorizationConfiguration.IsAnonymousAccessRestricted && currentUserAccessor.User.Identity is not { IsAuthenticated: true } &&
            !contentEndpointOptions.Value.AllowedAnonymousAccessRestrictedPaths.Any(r => r.IsMatch(path)))
        {
            return new UnauthorizedContentEndpointResult();
        }

        if (!IsAllowed(path))
        {
            log.LogWarning("Requested {path} is not allowed", path);

            return new NotAllowedContentEndpointResult();
        }

        DocumentId docId = path;
        var options = new ContentLoadOptions
            { DslEvaluation = filterOnClient ? DslEvaluation.PartialForClient : DslEvaluation.FullOnServer, PrefetchDepth = publicPagesConfiguration.PrefetchDepth };
        var content = await contentService.GetContentAsync<IDocument>(docId, cancellationToken, options);
        var validationResult = requestedContentValidator.Validate(content);

        switch (validationResult)
        {
            case OkRequestedContentValidationResult okResult:
                return new OkContentEndpointResult(await contentEndpointOptions.Value.ClientContentService.ConvertAsync(okResult.Document, cancellationToken, options));
            case NotFoundRequestedContentValidationResult _:
                log.LogWarning("Request for content at {docId} was not found (status = {status}, version = {version})",
                    docId,
                    content.Status.ToString(),
                    content.Metadata?.Version);

                return new NotFoundContentEndpointResult();
            case ErrorRequestedContentValidationResult errorResult:
                throw new Exception($"Content is invalid because {errorResult.Errors.ToDebugString()}");
            default:
                throw new VanillaBugException();
        }
    }

    private bool IsAllowed(string path)
    {
        return contentEndpointOptions.Value.DisallowedPaths.All(r => !r.IsMatch(path)) && contentEndpointOptions.Value.AllowedPaths.Any(r => r.IsMatch(path));
    }
}
