using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.ContentEndpoint;

/// <summary>
/// Provides content API shared with all consumers. Allows consumers to implement additional mappers and provide their own <see cref="IClientContentService"/> instance.
/// </summary>
[AllowAnonymous]
[Route("{culture}/api/[controller]")]
[ApiController]
public class ContentController : BaseController
{
    private readonly IContentEndpointService contentEndpointService;
    private readonly ILogger log;

    /// <summary>Creates the instance.</summary>
    public ContentController(IServiceProvider c)
        : this(c.GetRequiredService<IContentEndpointService>(),
            c.GetRequiredService<ILogger<ContentController>>()) { }

    internal ContentController(
        IContentEndpointService contentEndpointService,
        ILogger<ContentController> log)
    {
        this.contentEndpointService = contentEndpointService;
        this.log = log;
    }

    /// <summary>
    /// Get content from path.
    /// </summary>
    /// <param name="path"></param>
    /// <param name="cancellationToken"></param>
    /// <param name="filterOnClient"></param>
    [HttpGet]
    [BypassAntiForgeryToken]
    public async Task<IActionResult> Get(string path, CancellationToken cancellationToken, bool filterOnClient = false)
    {
        try
        {
            var result = await contentEndpointService.FetchContent(path, filterOnClient, cancellationToken);

            return result switch
            {
                OkContentEndpointResult okResult => OkResult(okResult.Document),
                UnauthorizedContentEndpointResult _ => Unauthorized(),
                NotAllowedContentEndpointResult _ => StatusCode(StatusCodes.Status404NotFound, new { error = "Requested content path is not allowed." }),
                NotFoundContentEndpointResult _ => NotFound(),
                _ => throw new VanillaBugException(),
            };
        }
        catch (Exception e)
        {
            log.LogError(e, "Failed fetching {path} with {filter}", path, filterOnClient);

            return StatusCode(StatusCodes.Status500InternalServerError, e);
        }
    }
}
