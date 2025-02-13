using System.Net;
using System.Text;
using System.Text.Encodings.Web;
using System.Web;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Frontend.Host.Features.HtmlInjection;

/// <summary>
/// SiteScriptsPosition.
/// </summary>
public enum SiteScriptsPosition
{
    /// <summary>
    /// Top position.
    /// </summary>
    Top,

    /// <summary>
    /// Bottom position.
    /// </summary>
    Bottom,
}

/// <summary>
/// Render SiteScripts from sitecore.
/// </summary>
public interface ISiteScriptsRenderer
{
    /// <summary>
    /// Render SiteScripts from sitecore.
    /// </summary>
    /// <returns></returns>
    Task<string> RenderAsync(SiteScriptsPosition position, CancellationToken cancellationToken);
}

internal sealed class SiteScriptsRenderer(IContentService contentService, IInternalRequestEvaluator internalRequestEvaluator) : ISiteScriptsRenderer
{
    public async Task<string> RenderAsync(SiteScriptsPosition position, CancellationToken cancellationToken)
    {
        var siteScripts = await contentService.GetChildrenAsync<IPCScript>(AppPlugin.ContentRoot + "/SiteScripts", cancellationToken);
        var builder = new StringBuilder();

        AppendComment("start:Sitecore scripts");

        foreach (var script in siteScripts)
        {
            if (script.IsFooter != (position == SiteScriptsPosition.Bottom))
                continue;

            var tag = new TagBuilder("script");

            if (internalRequestEvaluator.IsInternal())
            {
                tag.Attributes.Add("data-name", script.Metadata.Id.ItemName);
                tag.Attributes.Add("data-id", script.Metadata.Id.Id?.Replace("{", "").Replace("}", ""));
            }

            if (script.Reference != null)
                tag.Attributes.Add("src", script.Reference.Url.ToString());
            else if (!string.IsNullOrWhiteSpace(script.Code))
                tag.InnerHtml.Append(script.Code);
            else
                continue;

            await using var writer = new StringWriter();
            tag.WriteTo(writer, HtmlEncoder.Default);
            builder.AppendLine(WebUtility.HtmlDecode(writer.ToString()));
        }

        AppendComment("end:Sitecore scripts");

        return builder.ToString();

        void AppendComment(string text) => builder.Append(CreateHtmlComment(text));
    }

    private string CreateHtmlComment(string text)
    {
        if (internalRequestEvaluator.IsInternal())
        {
            return $"<!-- {HttpUtility.HtmlEncode(text)} -->";
        }

        return string.Empty;
    }
}
