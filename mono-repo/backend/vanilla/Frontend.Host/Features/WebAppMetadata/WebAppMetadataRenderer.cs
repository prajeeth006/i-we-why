using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Net;
using HtmlAgilityPack;
using Microsoft.Extensions.Logging;

namespace Frontend.Host.Features.WebAppMetadata;

internal interface IWebAppMetadataRenderer
{
    Task<string> RenderAsync(CancellationToken cancellationToken);
}

internal sealed class WebAppMetadataRenderer(IContentService contentService, IInternalRequestEvaluator internalRequestEvaluator, ILogger<WebAppMetadataRenderer> log)
    : IWebAppMetadataRenderer
{
    public async Task<string> RenderAsync(CancellationToken cancellationToken)
    {
        try
        {
            var metaTags = await contentService.GetRequiredAsync<IStaticFileTemplate>("App-v1.0/WebAppMetadata/MetaTags", cancellationToken);

            return WithDiagnostics(Sanitize(metaTags.Content));
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Loading of all MetaTags failed");

            return string.Empty;
        }
    }

    private string Sanitize(string? content)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(content);

        if (doc.ParseErrors.Any())
        {
            log.LogWarning("WebAppMetadata Meta Tags contain html parse {errors}",
                Environment.NewLine + doc.ParseErrors.Select(e => $" - Error {e.Code} at line {e.Line}:{e.LinePosition}: {e.Reason}.").Join(Environment.NewLine));
        }

        doc.DocumentNode.Descendants("script").ToList().Each(d => d.Remove());

        return doc.DocumentNode.OuterHtml;
    }

    private string WithDiagnostics(string content)
    {
        if (internalRequestEvaluator.IsInternal())
        {
            return $"<!-- start:web-app-metadata -->{content}<!-- end:web-app-metadata -->";
        }

        return content;
    }
}
