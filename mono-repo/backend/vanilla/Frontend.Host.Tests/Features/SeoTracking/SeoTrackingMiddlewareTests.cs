using System.Globalization;
using System.Security.Claims;
using System.Text.RegularExpressions;
using Frontend.Host.Features.SeoTracking;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.TrackerId;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.SeoTracking;

public sealed class SeoTrackingMiddlewareTests
{
    private readonly BeforeNextMiddleware target;
    private readonly SeoTrackingConfiguration config;
    private readonly Mock<IEndpointMetadata> endpointMetadata;
    private readonly Mock<IEnvironmentProvider> envProvider;
    private readonly Mock<ISeoTrackingCookies> seoTrackingCookies;
    private readonly Mock<ITrackerIdQueryParameter> trackerIdQueryParam;
    private readonly DefaultHttpContext httpContext;

    public SeoTrackingMiddlewareTests()
    {
        endpointMetadata = new Mock<IEndpointMetadata>();
        config = new SeoTrackingConfiguration();
        envProvider = new Mock<IEnvironmentProvider>();
        seoTrackingCookies = new Mock<ISeoTrackingCookies>();
        trackerIdQueryParam = new Mock<ITrackerIdQueryParameter>();
        target = new SeoTrackingMiddleware(
            Mock.Of<RequestDelegate>(),
            endpointMetadata.Object,
            config,
            envProvider.Object,
            seoTrackingCookies.Object,
            trackerIdQueryParam.Object);
        httpContext = new DefaultHttpContext();

        CultureInfoHelper.SetCurrent(new CultureInfo("en-US"));
        envProvider.SetupGet(p => p.CurrentLabel).Returns("bwin.com");
        config.WmidCookieName = "wmid";
        config.LandingUrlCookieName = "landing-url";
        config.SearchEngines = new[]
        {
            new SearchEngine { Name = "Google", ReferrerRegex = new Regex("google\\.com") },
            new SearchEngine { Name = "Seznam", ReferrerRegex = new Regex("seznam\\.cz") },
            new SearchEngine { Name = "Yahoo", ReferrerRegex = new Regex("yahoo\\.com") },
        };
        config.Wmids = new[]
        {
            // order more specific rules first,
            // order by SearchEngine, then CultureName, then CountryCode => see SeoTrackingConfigurationFactory
            new WmidRule { Wmid = "555", SearchEngine = "Google", CultureName = "fr-FR", CountryCode = "AT" },
            new WmidRule { Wmid = "111", SearchEngine = "Google", CultureName = "de-AT" },
            new WmidRule { Wmid = "444", SearchEngine = "Google", CountryCode = "AT" },
            new WmidRule { Wmid = "222", SearchEngine = "Google" },
            new WmidRule { Wmid = "333", SearchEngine = "Seznam" },
        };
        httpContext.Request.Scheme = "https";
        httpContext.Request.Host = new HostString("sports.bwin.com");
        httpContext.Request.Path = "/page";
        httpContext.Request.QueryString = new QueryString("?sportID=123");
        httpContext.Request.Headers[HttpHeaders.Referer] = "https://www.google.com/?q=sports";
        httpContext.User = TestUser.Get();
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
    }

    private void RunAndExpectTrackedWmid(string expectedWmid = "222")
    {
        // Act
        target.BeforeNext(httpContext);

        seoTrackingCookies.Verify(c => c.SetWmid(expectedWmid));
        seoTrackingCookies.Verify(c => c.SetLandingUrl(new Uri("https://sports.bwin.com/page?sportID=123")));
    }

    private void RunAndExpectNothingTracked()
    {
        // Act
        target.BeforeNext(httpContext);

        seoTrackingCookies.VerifyWithAnyArgs(c => c.SetWmid(It.IsAny<string>()), Times.Never());
        seoTrackingCookies.VerifyWithAnyArgs(c => c.SetLandingUrl(It.IsAny<Uri>()), Times.Never());
    }

    [Fact]
    public void ShouldTrackSearchEngine()
        => RunAndExpectTrackedWmid();

    [Theory]
    [InlineData("https://www.google.com/?q=sports", "de-AT", null, "111")]
    [InlineData("https://www.google.com/?q=sports", "en-US", null, "222")]
    [InlineData("https://www.seznam.cz/?p=casinos", "de-AT", null, "333")]
    [InlineData("https://www.google.com/?q=sports", null, "AT", "444")]
    [InlineData("https://www.google.com/?q=sports", "fr-FR", "AT", "555")]
    public void ShouldTrackAccordingToSearchEngineAndCultureAndCountry(string? referrer, string? culture, string? country, string expectedWmid)
    {
        if (culture != null) CultureInfoHelper.SetCurrent(new CultureInfo(culture));
        if (country != null) httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(PosApiClaimTypes.GeoIP.CountryId, country) }));
        httpContext.Request.Headers[HttpHeaders.Referer] = referrer;

        RunAndExpectTrackedWmid(expectedWmid);
    }

    [Fact]
    public void ShouldNotTrackIfNotServingHtml()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(false);
        RunAndExpectNothingTracked();
    }

    [Fact]
    public void ShouldNotTrack_IfNoWmids()
    {
        config.Wmids = new IWmidRule[0];
        RunAndExpectNothingTracked();
    }

    [Fact]
    public void ShouldNotTrack_IfNoReferrer()
    {
        httpContext.Request.Headers.Clear();

        RunAndExpectNothingTracked();
    }

    [Fact]
    public void ShouldNotTrackIfReferrerFromSameLabel()
    {
        httpContext.Request.Headers[HttpHeaders.Referer] = "https://caisno.bwin.com/lobby";
        RunAndExpectNothingTracked();
    }

    [Fact]
    public void ShouldNotTrackIfReferrerIsRelative()
    {
        httpContext.Request.Headers[HttpHeaders.Referer] = "casino.com";
        RunAndExpectNothingTracked();
    }

    [Fact]
    public void ShouldNotTrack_IfExcludeReferrerRegexIsMatched()
    {
        config.ExcludeReferrerRegex = new Regex("google");
        RunAndExpectNothingTracked();
    }

    [Fact]
    public void ShouldTrack_IfExcludeReferrerRegexIsNotMatched()
    {
        config.ExcludeReferrerRegex = new Regex("baidu");
        RunAndExpectTrackedWmid();
    }

    [Fact]
    public void ShouldNotTrack_IfExcludeCurrentUrlRegexIsMatched()
    {
        config.ExcludeCurrentUrlRegex = new Regex("sports");
        RunAndExpectNothingTracked();
    }

    [Fact]
    public void ShouldTrackIfExcludeCurrentUrlRegexIsNotMatched()
    {
        config.ExcludeCurrentUrlRegex = new Regex("casino");
        RunAndExpectTrackedWmid();
    }

    [Fact]
    public void ShouldNotTrack_IfTrackerIdInRequestUrl()
    {
        trackerIdQueryParam.Setup(p => p.GetValue()).Returns("666");
        RunAndExpectNothingTracked();
    }

    [Theory, ValuesData("111", "222", "333")]
    public void ShouldNotTrack_IfAlreadyTracked(string existingWmid)
    {
        seoTrackingCookies.Setup(c => c.GetWmid()).Returns(existingWmid);
        RunAndExpectNothingTracked();
    }

    [Fact]
    public void ShouldOverwriteCookie_IfNotWmidFromSeoTracking()
    {
        seoTrackingCookies.Setup(c => c.GetWmid()).Returns("000");
        RunAndExpectTrackedWmid();
    }

    [Theory]
    [InlineData("https://www.google.co.uk/?q=sports")]
    [InlineData("https://www.yahoo.com/?p=sports")]
    public void ShouldNotTrack_IfSearchEngineNotMatchedOrNoWmidSpecifiedForSearchEngine(string referrer)
    {
        httpContext.Request.Headers[HttpHeaders.Referer] = referrer;
        RunAndExpectNothingTracked();
    }

    [Theory]
    [InlineData("sw-KE", "555")]
    [InlineData("en-US", "666")]
    public void ShouldSupportWmidsWithoutSearchEngine(string culture, string expectedWmid)
    {
        CultureInfoHelper.SetCurrent(new CultureInfo(culture));
        config.Wmids = new[]
        {
            new WmidRule { Wmid = "555", CultureName = "sw-KE" },
            new WmidRule { Wmid = "666" },
        };

        RunAndExpectTrackedWmid(expectedWmid);
    }
}
