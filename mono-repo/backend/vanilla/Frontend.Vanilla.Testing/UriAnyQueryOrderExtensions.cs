using System;
using System.Linq;
using System.Web;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.Testing;

/// <summary>
///     Determines if two URLs are equal regardless of order of query string parameters.
/// </summary>
internal static class UriAnyQueryOrderExtensions
{
    public static bool EqualsAnyQueryOrder(this Uri uri1, Uri uri2)
    {
        if (uri1 == null || uri2 == null)
            return uri1 == uri2;

        if (!uri1.HasEqualComponents(uri2, UriComponents.SchemeAndServer | UriComponents.Path))
            return false;

        var qs1 = HttpUtility.ParseQueryString(uri1.Query);
        var qs2 = HttpUtility.ParseQueryString(uri2.Query);

        return qs1.Count == qs2.Count
               && qs1.AllKeys.All(key => qs1[key] == qs2[key]);
    }
}
