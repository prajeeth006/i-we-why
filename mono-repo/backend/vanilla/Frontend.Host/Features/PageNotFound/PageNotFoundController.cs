using Frontend.Host.Features.SiteRootFiles;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.PageNotFound;

public sealed class PageNotFoundController : Controller
{
    private readonly ISiteRootFileResolver siteRootFileResolver;

    public PageNotFoundController(IServiceProvider serviceProvider)
        : this(serviceProvider.GetRequiredService<ISiteRootFileResolver>()) { }

    internal PageNotFoundController(ISiteRootFileResolver siteRootFileResolver)
    {
        this.siteRootFileResolver = siteRootFileResolver;
    }

    [AllowAnonymous]
    public async Task<ActionResult> NotFoundAsync(CancellationToken cancellationToken)
    {
        var result = await siteRootFileResolver.ResolveAsync(Request.GetFullUrl().AbsolutePath, cancellationToken);

        if (result != null) return new SiteRootAspNetCoreFileResult(result);

        Response.StatusCode = StatusCodes.Status404NotFound;

        return View("Index");
    }
}
