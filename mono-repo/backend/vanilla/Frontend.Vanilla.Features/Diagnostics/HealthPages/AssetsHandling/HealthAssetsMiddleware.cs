using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.AssetsHandling;

/// <summary>
/// Serves static assets of health SPA. They are embedded in an assembly.
/// </summary>
internal sealed class HealthAssetsMiddleware : WebAbstractions.Middleware
{
    public const string FileNotFoundMessage = "Requested Health SPA file was not found.";

    private const string SpaBootstrapFile = "index.html";

    private readonly List<string> documentSpaRequestUrls =
        ["/health/config", "/health/cache", "/health/dsl", "/health/report", "/health/httpTester", "/health/log", "/health/content", "/health/info"];

    private readonly IAssemblyFileProvider fileProvider;
    private readonly Assembly assembly;
    private readonly RelativePath basePathWithinAssembly;
    private readonly string eTag;

    public HealthAssetsMiddleware(
        RequestDelegate next,
        IAssemblyFileProvider fileProvider,
        Assembly assembly,
        IEnumerable<IDiagnosticInfoProvider> diagnosticInfoProviders,
        RelativePath basePathWithinAssembly)
        : base(next)
    {
        this.fileProvider = fileProvider;
        this.assembly = assembly;
        this.basePathWithinAssembly = basePathWithinAssembly;

        // Guid on dev b/c no attr and assembly version is same between builds on dev machine
        var assemblyVersion = assembly.Get<AssemblyInformationalVersionAttribute>()?.InformationalVersion;
        eTag = $@"""{assemblyVersion ?? Guid.NewGuid().ToString()}""";
        documentSpaRequestUrls.AddRange(diagnosticInfoProviders.Select(p => $"/health/info/{p.Metadata.UrlPathSegment.Value}"));
    }

    public override Task InvokeAsync(HttpContext httpContext)
    {
        var urlPath = httpContext.Request.Path;
        var response = httpContext.Response;

        if (!urlPath.StartsWithIgnoreCase("/health", out var filePath)
            || urlPath.StartsWithSegments("/" + DiagnosticApiUrls.ApiBase)
            || IsLegacyHealthReport(urlPath))
            return Next(httpContext);

        if (httpContext.Request.Headers[HttpHeaders.IfNoneMatch] == eTag)
        {
            response.StatusCode = StatusCodes.Status304NotModified;

            return Task.CompletedTask;
        }

        response.Headers[HttpHeaders.CacheControl] = "public";
        response.Headers[HttpHeaders.ETag] = eTag;

        var fullFilePath = basePathWithinAssembly.Combine(documentSpaRequestUrls.Any(r => r == urlPath) ? SpaBootstrapFile : filePath.Value!.Substring(1));
        var fileStream = fileProvider.GetFileStream(assembly, fullFilePath);

        if (fileStream == null)
        {
            response.StatusCode = StatusCodes.Status404NotFound;

            return httpContext.WriteResponseAsync(ContentTypes.Text, FileNotFoundMessage);
        }

        response.ContentType = ContentTypes.Get(fullFilePath);
        response.ContentLength = fileStream.Length;

        return CopyFileToResponseAsync(fileStream);

        async Task CopyFileToResponseAsync(Stream fileStream) // Async overhead only if needed
        {
            using (fileStream)
                await fileStream.CopyToAsync(response.Body, httpContext.RequestAborted);
        }
    }

    private static bool IsLegacyHealthReport(PathString path)
        => path.EqualsIgnoreCase("/health");
}
