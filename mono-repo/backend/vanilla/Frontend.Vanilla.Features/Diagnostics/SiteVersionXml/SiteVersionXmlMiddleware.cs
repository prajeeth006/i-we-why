using System.IO;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.SiteVersionXml;

/// <summary>
/// Returns content of srvadm/version.xml file.
/// </summary>
internal sealed class SiteVersionXmlMiddleware(RequestDelegate next, IWebHostEnvironment webHostEnvironment) : WebAbstractions.Middleware(next)
{
    public override Task InvokeAsync(HttpContext httpContext)
    {
        if (!httpContext.Request.Path.EqualsIgnoreCase("/site/versionxml"))
        {
            return Next(httpContext);
        }

        var fullPath = Path.Combine(webHostEnvironment.ContentRootPath, "srvadm", "version.xml");

        if (!File.Exists(fullPath))
        {
            httpContext.Response.StatusCode = StatusCodes.Status404NotFound;

            return Task.CompletedTask;
        }

        var fileContent = File.ReadAllText(fullPath);

        return httpContext.WriteResponseAsync(ContentTypes.Xml, fileContent);
    }
}
