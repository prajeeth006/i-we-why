using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;

namespace Frontend.Vanilla.Features.TrackerId;

/// <summary>
/// Resolves trackerId ether from <see cref="ITrackerIdQueryParameter" /> or from corresponding cookie.
/// </summary>
internal interface ITrackerIdResolver
{
    TrimmedRequiredString? Resolve(bool includeCookie);
}

internal sealed class TrackerIdResolver(
    ITrackerIdQueryParameter queryParameter,
    ICookieHandler cookieHandler,
    ICookieJsonHandler cookieJsonHandler,
    ICurrentUserAccessor currentUserAccessor)
    : ITrackerIdResolver
{
    public const string CookieName = "trackerId";
    private const string PostLoginValuesWebmasterId = "WebmasterId";

    public TrimmedRequiredString? Resolve(bool includeCookie)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
            return queryParameter.GetValue() ?? (includeCookie ? ResolveFromCookie() : null);

        var affiliateInfo = cookieJsonHandler.GetValue(CookieConstants.PostLoginValues,
            PostLoginValuesWebmasterId.ToCamelCase());

        return !string.IsNullOrWhiteSpace(affiliateInfo) ? new TrimmedRequiredString(affiliateInfo.Trim()) : null;
    }

    private TrimmedRequiredString? ResolveFromCookie()
    {
        var cookieValue = cookieHandler.GetValue(CookieName);

        return !string.IsNullOrWhiteSpace(cookieValue) ? new TrimmedRequiredString(cookieValue.Trim()) : null;
    }
}
