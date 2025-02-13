namespace Frontend.Vanilla.Core.Rest;

/// <summary>
/// Constants with standard HTTP request and response headers.
/// </summary>
internal static class HttpHeaders
{
    public const string Accept = "Accept";
    public const string AcceptCharset = "Accept-Charset";
    public const string AcceptEncoding = "Accept-Encoding";
    public const string AcceptLanguage = "Accept-Language";
    public const string CacheControl = "Cache-Control";
    public const string ContentLength = "Content-Length";
    public const string ContentType = "Content-Type";
    public const string ETag = "ETag";
    public const string IfNoneMatch = "If-None-Match";
    public const string Link = "Link";
    public const string Location = "Location";
    public const string NativeApp = "X-Native-App";
    public const string Origin = "Origin";
    public const string Referer = "Referer";
    public const string ServerTiming = "Server-Timing";
    public const string SecFetchDest = "Sec-Fetch-Dest";
    public const string Sso = "x-sso";
    public const string TraceParent = "traceparent";
    public const string UserAgent = "User-Agent";
    public const string Via = "Via";
    public const string XAppContext = "X-App-Context";
    public const string XCookiesCleanup = "X-Cookies-Cleanup";
    public const string XCorrelationId = "X-Correlation-Id";
    public const string XForwardedFor = "X-Forwarded-For";
    public const string XFromProduct = "X-From-Product"; // TODO: remove when single domain migration is over
    public const string XJa3Hash = "x-ja3-hash";
    public const string XRedirectSource = "X-Redirect-Source";
    public const string XReloadOnLogin = "X-Reload-On-Login";
    public const string XBrowserUrl = "X-Bwin-Browser-Url";
    public const string XBrowserReferrer = "X-Bwin-Browser-Referrer";
}
