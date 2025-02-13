using Frontend.Host.Features.SiteRootFiles;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace Frontend.Host.Features.PageNotFound;

/// <summary>
/// Result which outputs site root file.
/// </summary>
internal sealed class SiteRootAspNetCoreFileResult : FileResult
{
    public SiteRootFileResult SiteRootFileResult { get; }

    internal SiteRootAspNetCoreFileResult(SiteRootFileResult result)
        : base(result.ContentType)
    {
        SiteRootFileResult = result;
    }

    public override Task ExecuteResultAsync(ActionContext context)
    {
        if (SiteRootFileResult.Content == null) return Task.CompletedTask;

        var headers = context.HttpContext.Response.GetTypedHeaders();
        headers.CacheControl =
            new CacheControlHeaderValue
            {
                Public = true,
                MaxAge = SiteRootFileResult.CacheTime,
            };
        headers.ContentType = new MediaTypeHeaderValue(SiteRootFileResult.ContentType);

        return context.HttpContext.Response.WriteAsync(SiteRootFileResult.Content, context.HttpContext.RequestAborted);
    }
}
