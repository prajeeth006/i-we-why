using Frontend.Host.Features.ClientApp;
using Frontend.Vanilla.Features.EntryWeb.Headers;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Logging;

namespace Frontend.Host.Features.StaticFiles;

internal sealed class ClientDistProxyMiddleware : Middleware
{
    private readonly IClientAppService clientAppService;
    private readonly IContentTypeProvider contentTypeProvider;
    private readonly IStaticFilesConfiguration staticFilesConfiguration;
    private readonly ILogger<ClientDistProxyMiddleware> log;

    public ClientDistProxyMiddleware(RequestDelegate next,
        IClientAppService clientAppService,
        IContentTypeProvider contentTypeProvider,
        IStaticFilesConfiguration staticFilesConfiguration,
        ILogger<ClientDistProxyMiddleware> log)
        : base(next)
    {
        this.clientAppService = clientAppService;
        this.contentTypeProvider = contentTypeProvider;
        this.staticFilesConfiguration = staticFilesConfiguration;
        this.log = log;
    }

    public override async Task InvokeAsync(HttpContext httpContext)
    {
        var subpath = httpContext.Request.Path;
        var response = await clientAppService.GetAsync(subpath, httpContext.RequestAborted);

        httpContext.Response.StatusCode = (int)response.Value.StatusCode;
        if (!response.Value.IsSuccessStatusCode || response.IsError)
        {
            log.LogError("ClientDistProxyMiddleware failed for {subpath}.", subpath);
            return;
        }

        // set content-type
        contentTypeProvider.TryGetContentType(subpath, out var contentType);
        httpContext.Response.ContentType = contentType;

        // set static files headers
        httpContext.AddStaticFilesResponseHeaders(staticFilesConfiguration);

        // serve response content
        var data = await response.Value.Content.ReadAsStreamAsync(httpContext.RequestAborted);
        await data.CopyToAsync(httpContext.Response.Body, httpContext.RequestAborted);
    }
}
