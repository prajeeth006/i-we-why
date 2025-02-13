using System.Net;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.RegularExpressions;
using System.Web;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.HtmlInjection;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Host.Features.HtmlInjection;

internal abstract class HtmlTagsRenderer(
    IHtmlInjectionControlOverride htmlInjectionControlOverride,
    IInternalRequestEvaluator internalRequestEvaluator,
    ICurrentLanguageResolver currentLanguageResolver,
    ILabelIsolatedDistributedCache labelIsolatedDistributedCache,
    IHttpClientFactory httpClientFactory,
    ILogger<HtmlTagsRenderer> logger)
{
    protected const string FooterTagName = "footer";
    protected const string UrlPattern = @"<script[^>]*src\s*=\s*['""]([^'""]*)['""][^>]*>";

    protected const string JSONCACHEKEY = $"JSONLD_SCHEMA_HTML_TAG";
    public abstract Task<string> RenderAsync(CancellationToken cancellationToken);

    protected virtual HtmlInjectionKind InjectionKind => HtmlInjectionKind.HeadTags;
    protected virtual bool IsInternalRequest => internalRequestEvaluator.IsInternal();
    protected virtual bool IsDisabled => htmlInjectionControlOverride.IsDisabled(InjectionKind);

    protected Dictionary<string, List<string>> GetActiveHeaderGroups(IEnumerable<HeadTags> headTags)
    {
        var headerGroup = new Dictionary<string, List<string>>();
        var valuesAdded = new List<string>();

        foreach (var conditionalHeadTag in headTags)
        {
            if (conditionalHeadTag.Tags == null || !conditionalHeadTag.Tags.Any() || !conditionalHeadTag.Condition.Evaluate())
            {
                continue;
            }

            foreach (var pair in conditionalHeadTag.Tags)
            {
                if (!headerGroup.ContainsKey(pair.Key))
                {
                    headerGroup.Add(pair.Key, new List<string>());
                }

                if (pair.Value == null || !pair.Value.Any())
                {
                    continue;
                }

                var values = pair.Value.Where(v => !valuesAdded.Contains(v.Value)).Select(v => v.Value).Distinct().ToArray();

                if (!values.Any())
                {
                    continue;
                }

                valuesAdded.AddRange(values);
                headerGroup[pair.Key].AddRange(values);
            }
        }

        return headerGroup;
    }

    protected async Task<string> RenderAsync(CancellationToken cancellationToken, string version, string tagGroupName, IEnumerable<HeadTags> headTags)
    {
        var schemaLinks = new List<string>();
        var contentBuilder = new StringBuilder();

        void AppendComment(string text) => contentBuilder.Append(CreateHtmlComment(text));

        if (IsDisabled)
        {
            return IsInternalRequest ? $"{CreateHtmlComment(version)}{CreateHtmlComment($"disabled:{tagGroupName}")}" : "";
        }

        if (IsInternalRequest)
        {
            AppendComment(version);
            AppendComment($"start:{tagGroupName}");
        }

        var headerGroup = GetActiveHeaderGroups(headTags);

        foreach (var name in headerGroup.Keys)
        {
            var group = headerGroup[name];

            if (IsInternalRequest)
            {
                AppendComment($"start:group:{name}");
            }

            foreach (var item in group.Distinct())
            {
                contentBuilder.Append(item);

                if (item.Contains("schema-type"))
                {
                    var match = Regex.Match(item, UrlPattern);

                    if (match.Success)
                    {
                        schemaLinks.Add(match.Groups[1].Value);
                    }
                }
            }

            if (IsInternalRequest)
            {
                AppendComment($"end:group:{name}");
            }
        }

        if (IsInternalRequest)
        {
            AppendComment($"end:{tagGroupName}");
        }

        if (schemaLinks.Count > 0)
        {
            var organizationSchema = await ProcessLinksAsync(cancellationToken, schemaLinks);
            contentBuilder.Append(organizationSchema);
        }

        return contentBuilder.ToString();
    }

    private async Task<string> GetJsonFromUrlAsync(string requestUrl, CancellationToken cancellationToken)
    {
        var cacheKey = GetCachedKey(requestUrl);
        var value = await labelIsolatedDistributedCache.GetStringAsync(ExecutionMode.Async(cancellationToken), cacheKey);

        if (value != null)
        {
            return value;
        }

        var newValue = await GetJsonFresh(requestUrl, cancellationToken);
        await labelIsolatedDistributedCache.SetStringAsync(
            ExecutionMode.Async(cancellationToken),
            cacheKey,
            newValue,
            new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1) });

        return newValue;
    }

    private string GetCachedKey(string requestUrl)
    {
        var currentLanguage = currentLanguageResolver.Language.ToString();
        return $"{JSONCACHEKEY}-{currentLanguage}-{requestUrl}";
    }

    private async Task<string> GetJsonFresh(string requestUrl, CancellationToken cancellationToken)
    {
        try
        {
            var extractedIdValue = requestUrl.Substring(requestUrl.LastIndexOf('/') + 1);
            extractedIdValue = extractedIdValue.Replace(".json", "");
            var httpClient = httpClientFactory.CreateClient();
            var response = await httpClient.GetStringAsync(requestUrl, cancellationToken);

            if (response.IsNullOrEmpty()) return string.Empty;

            var jObject = JObject.Parse(response);
            var schemaArray = (JArray)jObject["schema"]!;
            var jsonOutput = string.Empty;

            foreach (var schemaItem in schemaArray)
            {
                var langCulture = schemaItem["langCulture"]?.ToString();

                if (langCulture!.Equals(currentLanguageResolver.Language.ToString(), StringComparison.OrdinalIgnoreCase))
                {
                    var serializedScript = JsonConvert.SerializeObject(schemaItem);
                    var tag = new TagBuilder("script");
                    tag.MergeAttribute("id", extractedIdValue);
                    tag.MergeAttribute("type", "application/ld+json");
                    tag.InnerHtml.Append(serializedScript);
                    using var writer = new StringWriter();
                    tag.WriteTo(writer, HtmlEncoder.Default);
                    jsonOutput = WebUtility.HtmlDecode(writer.ToString());
                }
            }

            return jsonOutput;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to read json schema file from url. Check if file exists and if it is a valid json");

            return string.Empty;
        }
    }

    private async Task<string> ProcessLinksAsync(CancellationToken cancellationToken, List<string> schemaLinks)
    {
        try
        {
            cancellationToken.ThrowIfCancellationRequested();
            var results = await Task.WhenAll(schemaLinks.Select(schemaLink => GetJsonFromUrlAsync(schemaLink, cancellationToken)));

            return string.Join(Environment.NewLine, results);
        }
        catch (OperationCanceledException)
        {
            return string.Empty;
        }
    }

    private static string CreateHtmlComment(string text) => $"<!-- {HttpUtility.HtmlEncode(text)} -->";

    protected static IEnumerable<HeadTags> SelectWithoutTags(
        IDictionary<string, HeadTags> headTags,
        params string[] tags) => SelectWithTags(headTags, tag => !tags.Contains(tag));

    protected static IEnumerable<HeadTags> SelectWithTags(
        IDictionary<string, HeadTags> headTags,
        params string[] tags) => SelectWithTags(headTags, tags.Contains);

    protected static IEnumerable<HeadTags> SelectWithTags(
        IDictionary<string, HeadTags> headTags,
        Predicate<string> tagSelector)
    {
        foreach (var headTag in headTags)
        {
            var tags = (headTag.Value.Tags ?? new Dictionary<string, IDictionary<string, string>>())
                .Where(tag => tagSelector(tag.Key))
                .ToDictionary(tag => tag.Key, tag => tag.Value);

            if (!tags.Any())
            {
                continue;
            }

            yield return new HeadTags
            {
                Condition = headTag.Value.Condition,
                Tags = tags,
            };
        }
    }
}
