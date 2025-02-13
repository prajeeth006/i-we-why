using System.ComponentModel;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// "Properties of the current request URI.
///  In single-page application (mobile webs) values correspond to the URI which user sees in the browser address bar.
///  Sample: https://www.bwin.com/catalog/shownew.html?date=today".
/// </summary>
[Description("Properties of the current request URI." +
             " In single-page application (mobile webs) values correspond to the URI which user sees in the browser address bar." +
             " Example: https://www.bwin.com/catalog/shownew.html?date=today")]
public interface IRequestDslProvider
{
    /// <summary>The absolute full URI. Example: https://www.bwin.com/catalog/shownew.html?date=today.</summary>
    [Description("The absolute full URI. Example: https://www.bwin.com/en/catalog/shownew.html?date=today")]
    [ValueVolatility(ValueVolatility.Client)]
    string AbsoluteUri { get; }

    /// <summary>The absolute path of the URI. Example: /catalog/shownew.html.</summary>
    [Description("The absolute path of the URI. Example: /en/catalog/shownew.html")]
    [ValueVolatility(ValueVolatility.Client)]
    string AbsolutePath { get; }

    /// <summary>The absolute path concatenated with query of the URI. Example: /catalog/shownew.htm?date=today.</summary>
    [Description("The absolute path concatenated with query of the URI. Example: /en/catalog/shownew.htm?date=today")]
    [ValueVolatility(ValueVolatility.Client)]
    string PathAndQuery { get; }

    /// <summary>The query string of URI including leading question mark. Example: ?date=today.</summary>
    [Description("The query string of URI including leading question mark. Example: ?date=today")]
    [ValueVolatility(ValueVolatility.Client)]
    string Query { get; }

    /// <summary>The host of the URI. Example: www.bwin.com.</summary>
    [Description("The host of the URI. Example: www.bwin.com")]
    string Host { get; }

    /// <summary>
    /// The 'culture' token in URL path according to current route pattern. May not correspond to 'Culture.GetUrlToken(Culture.Current)' - see culture resolution in docs.
    /// May be empty if there is no 'culture' token in the route pattern. Example: en. NOTE: Value at /health/dsl doesn't reflect tested browser URL.
    /// </summary>
    [Description(
        "The 'culture' token in URL path according to current route pattern. May not correspond to 'Culture.GetUrlToken(Culture.Current)' - see culture resolution in docs."
        + " May be empty if there is no 'culture' token in the route pattern. Example: en. NOTE: Value at /health/dsl doesn't reflect tested browser URL.")]
    [ValueVolatility(ValueVolatility.Client)]
    string? CultureToken { get; }

    /// <summary>Indicates if the request is internal.</summary>
    [Description("Indicates if the request is internal")]
    [ValueVolatility(ValueVolatility.Client)]
    bool IsInternal { get; }

    /// <summary>Indicates if the request comes from a crawler and the response is processed via Prerender.io service. It is based on existence of 'X-Prerender: 1' request header.</summary>
    [Description(
        "Indicates if the request comes from a crawler and the response is processed via Prerender.io service. It is based on existence of 'X-Prerender: 1' request header.")]
    [ValueVolatility(ValueVolatility.Client)]
    bool IsPrerendered { get; }

    /// <summary>Client IP address resolved based on network routing rules.</summary>
    [Description("Client IP address resolved based on network routing rules.")]
    [ValueVolatility(ValueVolatility.Client)]
    string ClientIP { get; }

    /// <summary>Redirects user to specified absolute or relative URL. If executed server side then it's a temporary redirect.</summary>
    [Description("Redirects user to specified absolute or relative URL. If executed server side then it's a temporary redirect.")]
    [ValueVolatility(ValueVolatility.Client)]
    void Redirect(string url);

    /// <summary>
    /// Redirects user to specified absolute or relative URL specifying all details.
    /// PermanentRedirect makes sense only for initial document request and DSL executed server-side.
    /// PreserveQuery copies query part of current URL to destination URL.
    /// </summary>
    [Description("Redirects user to specified absolute or relative URL specifying all details."
                 + " PermanentRedirect makes sense only for initial document request and DSL executed server-side."
                 + " PreserveQuery copies query part of current URL to destination URL.")]
    [ValueVolatility(ValueVolatility.Client)]
    void Redirect(string url, bool permanentRedirect, bool preserveQuery);
}
