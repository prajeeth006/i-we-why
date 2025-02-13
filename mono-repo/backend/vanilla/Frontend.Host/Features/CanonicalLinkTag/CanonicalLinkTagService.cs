using System.Net;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Logging;

namespace Frontend.Host.Features.CanonicalLinkTag;

/// <summary>
/// Renders canonical link tags (for SEO) in the page header.
/// </summary>
internal interface ICanonicalLinkTagService
{
    string? Render(HttpUri requestUrl);
}

internal sealed class CanonicalLinkTagService(ICanonicalConfiguration config, IInternalRequestEvaluator internalRequestEvaluator, ILogger<CanonicalLinkTagService> log)
    : ICanonicalLinkTagService
{
    public string? Render(HttpUri requestUrl)
    {
        Guard.NotNull(requestUrl, nameof(requestUrl));
        CanonicalUrlRule? rule = null;

        try
        {
            var hostAndPath = $"{requestUrl.Host}{requestUrl.AbsolutePath.TrimEnd('/')}";
            rule = config.UrlRegexRules.FirstOrDefault(r => r.Value.HostAndPathRegex.IsMatch(hostAndPath)).Value;

            if (rule != null && rule.CanonicalUrl == null)
                return WithDiagnostics(result: null, status: "Opted-out", requestUrl, rule, "null");

            var replacedUrl = rule?.CanonicalUrl != null
                ? new HttpUri(rule.HostAndPathRegex.Replace(hostAndPath, rule.CanonicalUrl))
                : requestUrl;

            // Take query strings from original request while ignoring the ones (potentially) coming from matched rule
            var queryString = QueryUtil.Parse(requestUrl.Query.ToLowerInvariant());
            foreach (var queryParamName in queryString.Keys.Except(config.QueryStringsToKeep, StringComparer.OrdinalIgnoreCase).ToList())
                queryString.Remove(queryParamName);

            var builder = new UriBuilder(replacedUrl)
            {
                Scheme = rule != null ? replacedUrl.Scheme : Uri.UriSchemeHttps, // Honor scheme from the rule
                Port = -1, // Default port for scheme
                Query = WebUtility.HtmlEncode(QueryUtil.Build(queryString, false)),
                Fragment = "",
            };
            var resultUrl = builder.Uri.AbsoluteUri.TrimEnd('/').ToLowerInvariant();

            return WithDiagnostics($"<link rel=\"canonical\" href=\"{resultUrl}\" />", "Succeeded", requestUrl, rule, resultUrl);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed evaluating canonical tag for {requestUrl} using matched {@rule}", requestUrl, rule);

            return WithDiagnostics(result: null, status: "Failed", requestUrl, rule, ex);
        }
    }

    private string? WithDiagnostics(string? result, string status, HttpUri requestUrl, CanonicalUrlRule? rule, object resultDetails)
    {
        if (!internalRequestEvaluator.IsInternal())
            return result;

        var ruleDetails = rule != null ? $"/{rule.HostAndPathRegex}/ to {rule.CanonicalUrl ?? "null"}" : "(default, no configured rule matched)";
        var diagnostics = $"Canonical link tag diagnostics: {status} canonization of {requestUrl} using rule {ruleDetails} with result {resultDetails}.";

        return $"{result}<!-- {WebUtility.HtmlEncode(diagnostics)} -->";
    }
}
