using System;
using System.Web;

namespace Frontend.Vanilla.Core.System.Uris;

/// <summary>
/// Provides extension methods for <see cref="Uri" />.
/// </summary>
internal static class UriExtensions
{
    /// <summary>Determines if two URIs have equal components using the specified comparison rules.</summary>
    internal static bool HasEqualComponents(
        this Uri uri1,
        Uri uri2,
        UriComponents components,
        UriFormat format = UriFormat.SafeUnescaped,
        StringComparison comparison = StringComparison.OrdinalIgnoreCase)
        => Uri.Compare(uri1, uri2, components, format, comparison) == 0;

    /// <summary>Determines if specified URI is an absolute HTTP(s) URL which specifies host of some service.</summary>
    internal static bool IsHttpHost(this Uri uri)
        => uri.IsHttp() && string.IsNullOrEmpty(uri.Query) && string.IsNullOrEmpty(uri.Fragment);

    /// <summary>Determines if specified URI is an absolute HTTP(s) URL.</summary>
    internal static bool IsHttp(this Uri uri)
        => uri.IsAbsoluteUri && uri.Scheme.EqualsAny(Uri.UriSchemeHttp, Uri.UriSchemeHttps);

    /// <summary>Clones given HTTP URL and configures this new one using specified func.</summary>
    internal static HttpUri BuildNew(this HttpUri uri, Action<UriBuilder> buildFunc)
    {
        var builder = new UriBuilder(uri);
        buildFunc(builder);

        return builder.GetHttpUri();
    }

    /// <summary>Replaces value of given key with asterisks.</summary>
    internal static HttpUri HideSensitiveQueryParamValue(this HttpUri uri, string key)
    {
        var query = HttpUtility.ParseQueryString(uri.Query);

        if (query?[key] != null)
        {
            query[key] = new string('*', query[key]!.Length);
            var builder = new UriBuilder(uri);
            builder.Query = query.ToString();
            return builder.GetHttpUri();
        }

        return uri;
    }

    public static HttpUri ToHttps(this HttpUri url)
        => url.Scheme != Uri.UriSchemeHttps
            ? url.BuildNew(u => u.ChangeSchemeWithPort(Uri.UriSchemeHttps))
            : url;
}
