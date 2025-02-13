using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Host.Features.SiteRootFiles;

/// <summary>
/// Tries to resolve site root file on given path within configured folder in Sitecore.
/// </summary>
internal interface ISiteRootFileResolver
{
    Task<SiteRootFileResult?> ResolveAsync(PathString urlPath, CancellationToken cancellationToken);
}

internal sealed class SiteRootFileResolver(
    IContentService contentService,
    IDynaConParameterExtractor dynaConParameterExtractor,
    ILogger<SiteRootFileResolver> log)
    : ISiteRootFileResolver
{
    public async Task<SiteRootFileResult?> ResolveAsync(PathString urlPath, CancellationToken cancellationToken)
    {
        if (urlPath.IsRoot())
            return null;

        try
        {
            var file = await LoadContentAsync(urlPath, cancellationToken);

            return file != null ? ConvertToResult(file, urlPath) : null;
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed retrieving site root file '{urlPath}'.", ex);
        }
    }

    private async Task<IStaticFileTemplate?> LoadContentAsync(PathString urlPath, CancellationToken cancellationToken)
    {
        const string folderPath = "App-v1.0/SiteRootFiles";
        var checkedContent = new List<Content<IDocument>>();

        foreach (var contentPath in new[] { $"{folderPath}/{dynaConParameterExtractor.Product}{urlPath}", $"{folderPath}{urlPath}" })
        {
            var content = await contentService.GetContentAsync<IDocument>(contentPath, cancellationToken);

            switch (content)
            {
                case SuccessContent<IDocument> success when success.Document is IStaticFileTemplate file:
                    return file;
                case InvalidContent<IDocument> invalid:
                    throw new Exception($"Underlying content {content.Id} exists but with Errors: {invalid.Errors.ToDebugString()}");
                default:
                    checkedContent.Add(content);

                    break;
            }
        }

        log.LogWarning(
            "SiteRootFile at {urlPath} is not found because of {underlyingContent}. It's up to you to evaluate and investigate if this is an error, dangerous request or regular traffic",
            urlPath.ToString(),
            checkedContent.Join());

        return null;
    }

    private SiteRootFileResult ConvertToResult(IStaticFileTemplate file, PathString urlPath)
    {
        var contentType = file.MimeType.WhiteSpaceToNull()
                          ?? StaticFilesOptions.ContentTypes.GetValue(Path.GetExtension(urlPath))?.Name
                          ?? ContentTypes.Text;

        var cacheTime = file.ClientCacheTime > 0
            ? TimeSpan.FromMinutes(file.ClientCacheTime)
            : TimeSpan.FromHours(4);

        return new SiteRootFileResult(contentType, cacheTime, file.Content);
    }
}
