using System.Globalization;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.TrackerId;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.ServiceClients.Claims;
using Microsoft.AspNetCore.Http;

namespace Frontend.Host.Features.SeoTracking;

internal sealed class SeoTrackingMiddleware(
    RequestDelegate next,
    IEndpointMetadata endpointMetadata,
    ISeoTrackingConfiguration config,
    IEnvironmentProvider envProvider,
    ISeoTrackingCookies seoTrackingCookies,
    ITrackerIdQueryParameter trackerIdQueryParam)
    : BeforeNextMiddleware(next)
{
    public override void BeforeNext(HttpContext httpContext)
    {
        if (!endpointMetadata.Contains<ServesHtmlDocumentAttribute>())
            return;

        var request = httpContext.Request;
        var referrer = DictionaryExtensions.GetValue(request.Headers, HttpHeaders.Referer).ToString();

        if (string.IsNullOrEmpty(referrer))
            return;

        var url = request.GetFullUrl();
        var uriReferrer = new Uri(referrer, UriKind.RelativeOrAbsolute);

        if (config.Wmids.Count == 0
            || !uriReferrer.IsAbsoluteUri
            || envProvider.IsCurrentLabel(uriReferrer)
            || config.ExcludeReferrerRegex?.IsMatch(uriReferrer.AbsoluteUri) == true
            || config.ExcludeCurrentUrlRegex?.IsMatch(url.AbsoluteUri) == true
            || !string.IsNullOrWhiteSpace(trackerIdQueryParam.GetValue()?.Value)
            || IsSearchEngineAlreadyTracked())
            return;

        // Match search engine
        var searchEngine = config.SearchEngines.FirstOrDefault(e => e.ReferrerRegex.IsMatch(uriReferrer.AbsoluteUri));

        if (searchEngine == null)
            return;

        var countryCode = httpContext.User.FindValue(PosApiClaimTypes.GeoIP.CountryId);

        // Get first matching WMID
        var wmid = config.Wmids.FirstOrDefault(w =>
            (w.SearchEngine == null || w.SearchEngine == searchEngine.Name) &&
            (w.CountryCode == null || w.CountryCode.Equals(countryCode)) &&
            (w.CultureName == null || w.CultureName.Equals(CultureInfo.CurrentCulture.Name)));

        if (wmid != null)
        {
            seoTrackingCookies.SetWmid(wmid.Wmid);
            seoTrackingCookies.SetLandingUrl(url);
        }
    }

    private bool IsSearchEngineAlreadyTracked()
    {
        var previousWmid = seoTrackingCookies.GetWmid();

        return !string.IsNullOrWhiteSpace(previousWmid)
               && config.Wmids.Any(w => w.Wmid == previousWmid);
    }
}
