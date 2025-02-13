using System.Linq;
using System.Web;

namespace Frontend.Vanilla.Diagnostics.Contracts;

public static class DiagnosticApiUrls
{
    public const string ApiBase = "health/_api";
    public const string ServerInfoUrl = ApiBase + "/serverinfo";
    public const string ClearMemoryCacheUrl = ApiBase + "/memorycache/clear";

    public static class Configuration
    {
        public const string Report = ApiBase + "/config";
        public const string Feature = Report + "/feature";

        public static class SharedOverrides
        {
            public const string ShareUrl = ReceiveUrl + "/url";
            public const string ReceiveUrl = Report + "/shared-overrides";
            public const string OverridesParameter = "overrides";
        }

        public static class Overrides
        {
            public const string UrlTemplate = Report + "/overrides/{" + FeatureParameter + "?}/{" + KeyParameter + "?}";
            public const string FeatureParameter = "feature";
            public const string KeyParameter = "key";

            public static string GetUrl(string? featureName = null, string? keyName = null)
                => UrlTemplate
                    .Replace("{" + FeatureParameter + "?}", Encode(featureName))
                    .Replace("{" + KeyParameter + "?}", Encode(keyName))
                    .TrimEnd('/');
        }
    }

    public static class InfoPages
    {
        public const string Overview = ApiBase + "/info";

        public static class Details
        {
            public const string UrlTemplate = Overview + "/{" + PathParameter + "}";
            public const string PathParameter = "path";

            public static string GetUrl(string pagePath)
                => UrlTemplate.Replace("{" + PathParameter + "}", Encode(pagePath));
        }
    }

    public static class HttpTester
    {
        private const string RestBase = ApiBase + "/httpTester";
        public const string Url = RestBase + "/test";
        public const string UrlParameter = "url";
        public const string HeadersParameter = "headers";

        public static string GetUrl(string url, string? headers)
            => BuildUrl(Url, (UrlParameter, url), (HeadersParameter, headers));
    }

    public static class Cache
    {
        private const string RestBase = ApiBase + "/cache";

        public static class Info
        {
            public const string Url = RestBase + "/info";
        }

        public static class View
        {
            public const string Url = RestBase + "/view";
            public const string KeyParameter = "key";

            public static string GetUrl(string key)
                => BuildUrl(Url, (KeyParameter, key));
        }
    }

    public static class Dsl
    {
        private const string DslBase = ApiBase + "/dsl";
        public const string Metadata = DslBase + "/metadata";
        public const string ProvidersValues = DslBase + "/providers/values";

        public static class ExpressionTest
        {
            public const string UrlTemplate = DslBase + "/expressiontest";

            public static class Parameters
            {
                public const string Expression = "expression";
                public const string ResultType = "resultType";
                public const string BrowserUrl = "browserUrl";
            }

            public static string GetUrl(string expression, string resultType, string browserUrl)
                => BuildUrl(UrlTemplate,
                    (Parameters.Expression, expression),
                    (Parameters.ResultType, resultType),
                    (Parameters.BrowserUrl, browserUrl));
        }
    }

    public static class Health
    {
        public const string UrlTemplate = "health";
    }

    public static class LogAndTracing
    {
        public const string Tracing = ApiBase + "/tracing";

        public static class Log
        {
            public const string UrlTemplate = ApiBase + "/log";
            public const string OnlyMyEntriesParameter = "onlyMyEntries";

            public static string GetUrl(bool onlyMyEntries)
                => BuildUrl(UrlTemplate, (OnlyMyEntriesParameter, onlyMyEntries));
        }
    }

    public static class Content
    {
        private const string ContentBase = ApiBase + "/content";
        public const string MetadataUrl = ContentBase + "/metadata";

        public static class ItemTest
        {
            public const string UrlTemplate = ContentBase;

            public static class Parameters
            {
                public const string Path = "path";
                public const string PathRelativity = "pathRelativity";
                public const string Culture = "contentCulture"; // Just "culture" is used by routing -> would be a conflict
                public const string RequireTranslation = "requireTranslation";
                public const string DslEvaluation = "dslEvaluation";
                public const string BypassCache = "bypassCache";
                public const string Revision = "revision";
            }

            public static string GetUrl(
                string path,
                string pathRelativity,
                string culture,
                bool requireTranslation,
                string dslEvaluation,
                bool bypassCache,
                string revision)
                => BuildUrl(UrlTemplate,
                    (Parameters.Path, path),
                    (Parameters.PathRelativity, pathRelativity),
                    (Parameters.Culture, culture),
                    (Parameters.RequireTranslation, requireTranslation),
                    (Parameters.DslEvaluation, dslEvaluation),
                    (Parameters.BypassCache, bypassCache),
                    (Parameters.Revision, revision));
        }
    }

    private static string BuildUrl(string baseUrl, params (string Key, object? Value)[] query)
        => baseUrl + "?" + string.Join("&", query.Select(q => $"{q.Key}={Encode(q.Value?.ToString())}"));

    private static string Encode(string? urlData)
        => urlData != null ? HttpUtility.UrlEncode(urlData) : string.Empty;
}
