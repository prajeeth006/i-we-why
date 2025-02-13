using System.Net;

namespace Frontend.Vanilla.Core.Net;

/// <summary>
/// Extension methods for <see cref="HttpStatusCode" />.
/// </summary>
public static class HttpStatusCodeExtensions
{
    /// <summary>
    /// Determines if given HTTP status code is 2XX class therefore denotes a success.
    /// </summary>
    public static bool IsSucccess(this HttpStatusCode code)
        => code.GetCategory() == HttpStatusCategory.Success;

    internal static HttpStatusCategory GetCategory(this HttpStatusCode code)
        => (HttpStatusCategory)((int)code / 100);
}

internal enum HttpStatusCategory
{
    Informational = 1,
    Success = 2,
    Redirection = 3,
    ClientError = 4,
    ServerError = 5,
}
