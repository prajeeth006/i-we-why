using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.AccountMenu;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Diagnostics;
using Frontend.Vanilla.Features.DynamicLayout;
using Frontend.Vanilla.Features.EntryWeb.DataLayer;
using Frontend.Vanilla.Features.EntryWeb.Prerender;
using Frontend.Vanilla.Features.FeatureFlags;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.Header;
using Frontend.Vanilla.Features.InactivityScreen;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.Page;
using Frontend.Vanilla.Features.Products;
using Frontend.Vanilla.Features.Theming;
using Frontend.Vanilla.Features.UI;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.AbstractTests;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Page;

public class PageClientConfigProviderTests : ClientConfigProviderTestsBase
{
    private readonly Mock<ITrackingConfiguration> trackingConfiguration;
    private readonly Mock<IEnvironmentProvider> environmentProvider;
    private readonly Mock<ILanguageService> languageService;
    private readonly Mock<IUserInterfaceConfiguration> userInterfaceConfiguration;
    private readonly Mock<IAuthorizationConfiguration> authorizationConfiguration;
    private readonly Mock<IAuthenticationConfiguration> authenticationConfiguration;
    private readonly Mock<IGlobalJavascriptErrorHandlerConfiguration> globalJsErrorHandlerConfig;
    private readonly Mock<IContentService> contentService;
    private readonly Mock<ICookieConfiguration> cookieConfiguration;
    private readonly Mock<ICurrentProductResolver> currentProductResolver;
    private readonly Mock<ILinkTemplate> homePageLink;
    private readonly Mock<ILinkTemplate> loginLink;
    private readonly Mock<ILoadingIndicatorConfiguration> loadingIndicatorConfiguration;
    private readonly Mock<IProfilingConfiguration> profilingConfiguration;
    private readonly Mock<IInternalRequestEvaluator> internalRequestEvaluator;
    private readonly Mock<IThemeResolver> themeResolver;
    private readonly Mock<IClientIPResolver> clientIpResolver;
    private readonly Mock<IInactivityScreenConfiguration> inactivityScreenConfiguration;
    private readonly Mock<IContentConfiguration> contentConfiguration;
    private readonly Mock<IDynamicLayoutConfiguration> dynamicLayoutConfiguration;
    private readonly Mock<IVisitorSettingsLanguageResolver> visitorSettingsLanguageResolver;
    private readonly Mock<IAccountMenuConfiguration> accountMenuConfiguration;
    private readonly Mock<IHeaderConfiguration> headerConfiguration;
    private readonly Mock<IPrerenderDetector> prerenderDetector;
    private readonly Mock<IHiddenLanguagesResolver> hiddenLanguageResolver;
    private readonly Mock<IFeatureFlagsConfiguration> featuresFlagsConfiguration;
    private readonly Mock<ILoginSettingsConfiguration> loginConfig;
    private readonly TestLogger<PageClientConfigProvider> log;

    private readonly LanguageInfo currentLang;
    private readonly LanguageInfo otherLang;
    private readonly ClientEvaluationResult<bool> enableScroll = ClientEvaluationResult<bool>.FromClientExpression("FALSE");

    public PageClientConfigProviderTests()
    {
        trackingConfiguration = new Mock<ITrackingConfiguration>();
        environmentProvider = new Mock<IEnvironmentProvider>();
        languageService = new Mock<ILanguageService>();
        contentService = new Mock<IContentService>();
        cookieConfiguration = new Mock<ICookieConfiguration>();
        userInterfaceConfiguration = new Mock<IUserInterfaceConfiguration>();
        currentProductResolver = new Mock<ICurrentProductResolver>();
        authorizationConfiguration = new Mock<IAuthorizationConfiguration>();
        authenticationConfiguration = new Mock<IAuthenticationConfiguration>();
        globalJsErrorHandlerConfig = new Mock<IGlobalJavascriptErrorHandlerConfiguration>();
        homePageLink = new Mock<ILinkTemplate>();
        loginLink = new Mock<ILinkTemplate>();
        loadingIndicatorConfiguration = new Mock<ILoadingIndicatorConfiguration>();
        profilingConfiguration = new Mock<IProfilingConfiguration>();
        internalRequestEvaluator = new Mock<IInternalRequestEvaluator>();
        themeResolver = new Mock<IThemeResolver>();
        clientIpResolver = new Mock<IClientIPResolver>();
        inactivityScreenConfiguration = new Mock<IInactivityScreenConfiguration>();
        contentConfiguration = new Mock<IContentConfiguration>();
        dynamicLayoutConfiguration = new Mock<IDynamicLayoutConfiguration>();
        visitorSettingsLanguageResolver = new Mock<IVisitorSettingsLanguageResolver>();
        accountMenuConfiguration = new Mock<IAccountMenuConfiguration>();
        headerConfiguration = new Mock<IHeaderConfiguration>();
        prerenderDetector = new Mock<IPrerenderDetector>();
        hiddenLanguageResolver = new Mock<IHiddenLanguagesResolver>();
        featuresFlagsConfiguration = new Mock<IFeatureFlagsConfiguration>();
        loginConfig = new Mock<ILoginSettingsConfiguration>();
        log = new TestLogger<PageClientConfigProvider>();

        Target = new PageClientConfigProvider(
            trackingConfiguration.Object,
            environmentProvider.Object,
            languageService.Object,
            contentService.Object,
            cookieConfiguration.Object,
            userInterfaceConfiguration.Object,
            currentProductResolver.Object,
            authorizationConfiguration.Object,
            authenticationConfiguration.Object,
            globalJsErrorHandlerConfig.Object.GetGuardedDisableable(),
            loadingIndicatorConfiguration.Object,
            profilingConfiguration.Object.GetGuardedDisableable(),
            internalRequestEvaluator.Object,
            themeResolver.Object,
            clientIpResolver.Object,
            inactivityScreenConfiguration.Object,
            contentConfiguration.Object,
            dynamicLayoutConfiguration.Object,
            visitorSettingsLanguageResolver.Object,
            headerConfiguration.Object,
            accountMenuConfiguration.Object,
            prerenderDetector.Object,
            hiddenLanguageResolver.Object,
            featuresFlagsConfiguration.Object,
            loginConfig.Object,
            log);

        currentLang = TestLanguageInfo.Get("de", routeValue: "en", angularLocale: "en-Angular", htmlLangAttribute: "en-html");
        otherLang = TestLanguageInfo.Get(routeValue: "xx");
        cookieConfiguration.SetupGet(c => c.CurrentLabelDomain).Returns(".bwin.dev");
        languageService.SetupGet(r => r.Current).Returns(currentLang);
        languageService.SetupGet(r => r.UseBrowserLanguage).Returns(true);
        languageService.SetupGet(r => r.BrowserPreferredCulture).Returns("en-GB");
        languageService.SetupGet(r => r.Allowed).Returns(new[] { currentLang, otherLang });
        contentService.Setup(s => s.GetRequiredAsync<ILinkTemplate>("App-v1.0/Links/Home", Ct, new ContentLoadOptions { RequireTranslation = true }))
            .ReturnsAsync(homePageLink.Object);
        contentService.Setup(s => s.GetRequiredAsync<ILinkTemplate>("App-v1.0/Links/Login", Ct, new ContentLoadOptions { RequireTranslation = true }))
            .ReturnsAsync(loginLink.Object);
        userInterfaceConfiguration.Setup(o => o.ScrollBehaviorEnabledCondition.EvaluateForClientAsync(Ct)).ReturnsAsync(enableScroll);
        clientIpResolver.Setup(r => r.Resolve()).Returns(IPAddress.Parse("1.2.3.4"));
        userInterfaceConfiguration.Setup(o => o.Breakpoints).Returns(new Dictionary<string, string>
        {
            { "sm", "screen" },
            { "md", "md-screen" },
        });
        hiddenLanguageResolver.Setup(r => r.Resolve()).Returns(new[] { otherLang });
        featuresFlagsConfiguration.SetupGet(c => c.FeatureFlags)
            .Returns(new Dictionary<string, bool>() { { "group", true } });
    }

    public static IEnumerable<object[]> TestCases => TestValues.Booleans.ToTestCases()
        .CombineWith(TestValues.Booleans)
        .CombineWith(TestValues.Booleans)
        .CombineWith(TestValues.Booleans)
        .CombineWith(Enum<SameSiteFlag>.Values);

    [Theory, MemberData(nameof(TestCases))]
    public async Task ShouldReturnPageProperties(
        bool isProduction,
        bool isInternal,
        bool isAnonymousAccessRestricted,
        bool profilingEnabled,
        SameSiteFlag sameSite)
    {
        var defaultLanguage = TestLanguageInfo.Get();
        var imageProfiles = new Dictionary<string, ImageProfileSet>
        {
            { "default", new ImageProfileSet("w", new[] { 5, 6 }) },
        };
        userInterfaceConfiguration.SetupGet(c => c.HtmlSourceTypeReplace).Returns(new Dictionary<string, string> { ["vn-icon-test"] = "account-menu" });
        userInterfaceConfiguration.SetupGet(c => c.EnableDsScrollbar).Returns(false);
        environmentProvider.Setup(p => p.IsProduction).Returns(isProduction);
        environmentProvider.Setup(p => p.Environment).Returns("prod");
        languageService.SetupGet(c => c.Default).Returns(defaultLanguage);
        homePageLink.SetupGet(l => l.Url).Returns(new Uri("http://home.com"));
        cookieConfiguration.Setup(c => c.DefaultSameSiteMode).Returns(sameSite);
        cookieConfiguration.SetupGet(c => c.Secure).Returns(true);
        loginLink.SetupGet(l => l.Url).Returns(new Uri("http://home.com/login"));
        currentProductResolver.SetupGet(d => d.ProductLegacy).Returns("sports");
        loadingIndicatorConfiguration.SetupGet(c => c.DefaultDelay).Returns(TimeSpan.FromMilliseconds(250));
        loadingIndicatorConfiguration.SetupGet(c => c.ExternalNavigationDelay).Returns(TimeSpan.FromMilliseconds(500));
        loadingIndicatorConfiguration.SetupGet(c => c.SpinnerContent).Returns("spinner");
        userInterfaceConfiguration.SetupGet(c => c.Currency).Returns(new Dictionary<string, string> { ["default"] = "symbol" });
        userInterfaceConfiguration.SetupGet(c => c.UserDisplayNameProperties).Returns(new List<string> { "username" });
        authorizationConfiguration.SetupGet(c => c.IsAnonymousAccessRestricted).Returns(isAnonymousAccessRestricted);
        authenticationConfiguration.SetupGet(c => c.SingleSignOnDomains).Returns(new List<string> { "vanilla.intranet", "portal.intranet" });
        authenticationConfiguration.SetupGet(c => c.SingleSignOnLabels).Returns(new List<string> { "vanilla.intranet", "portal.intranet" });
        userInterfaceConfiguration.SetupGet(c => c.ImageProfiles).Returns(imageProfiles);
        globalJsErrorHandlerConfig.SetupGet(c => c.IsEnabled).Returns(true);
        globalJsErrorHandlerConfig.SetupGet(c => c.DebounceInterval).Returns(TimeSpan.FromSeconds(3));
        globalJsErrorHandlerConfig.SetupGet(c => c.MaxErrorsPerBatch).Returns(15);
        profilingConfiguration.SetupGet(o => o.IsEnabled).Returns(profilingEnabled);
        internalRequestEvaluator.Setup(e => e.IsInternal()).Returns(isInternal);
        inactivityScreenConfiguration.SetupGet(i => i.Mode).Returns("Betstation");
        contentConfiguration.SetupGet(o => o.ItemPathDisplayModeEnabled).Returns(true);
        themeResolver.Setup(e => e.GetTheme()).Returns("black");
        var slotStyle = new Dictionary<string, IDictionary<string, string>>
            { ["app"] = new Dictionary<string, string> { ["min-height"] = "100%" } };
        dynamicLayoutConfiguration.SetupGet(o => o.SlotStyle).Returns(slotStyle);
        visitorSettingsLanguageResolver.Setup(c => c.Resolve()).Returns(TestLanguageInfo.Get(culture: "en-US"));
        accountMenuConfiguration.SetupGet(c => c.Version).Returns(6);
        headerConfiguration.SetupGet(c => c.Version).Returns(5);
        prerenderDetector.SetupGet(c => c.IsRequestFromPrerenderService).Returns(true);
        trackingConfiguration.SetupGet(c => c.CrossDomainRegExG4).Returns("/bwin.be/");

        var config = await Target_GetConfigAsync();

        config.Should().BeEquivalentTo(new Dictionary<string, object>
        {
            { "enableDsScrollbar", false },
            { "htmlSourceTypeReplace", new Dictionary<string, object> { ["vn-icon-test"] = "account-menu" } },
            { "lang", (TrimmedRequiredString)"en" },
            { "languageCode", "de" },
            { "htmlLang", (TrimmedRequiredString)"en-html" },
            { "culture", "de" },
            { "locale", (TrimmedRequiredString)"en-Angular" },
            { "environment", (TrimmedRequiredString)"prod" },
            { "isProduction", isProduction },
            { "isInternal", isInternal },
            { "clientIP", "1.2.3.4" },
            { "domain", ".bwin.dev" },
            { "defaultLanguage", defaultLanguage },
            { "languages", new[] { (TrimmedRequiredString)"en", (TrimmedRequiredString)"xx" } },
            {
                "uiLanguages",
                new[]
                {
                    new { currentLang.Culture, currentLang.NativeName, currentLang.RouteValue },
                    new { otherLang.Culture, otherLang.NativeName, otherLang.RouteValue },
                }
            },
            { "homePage", new Uri("http://home.com") },
            { "loginUrl", new Uri("http://home.com/login") },
            { "product", (TrimmedRequiredString)"sports" },
            { "isAnonymousAccessRestricted", isAnonymousAccessRestricted },
            { "logging", new { isEnabled = true, maxErrorsPerBatch = 15, debounceInterval = 3000, url = "/log" } },
            { "loadingIndicator", new { defaultDelay = 250, externalNavigationDelay = 500, spinnerContent = "spinner" } },
            { "currency", new Dictionary<string, string> { ["default"] = "symbol" } },
            { "isProfilingEnabled", profilingEnabled },
            { "userDisplayNameProperties", new[] { "username" } },
            { "isSingleDomainApp", false },
            { "imageProfiles", imageProfiles },
            { "cookies", new { sameSiteMode = sameSite, secure = true } },
            { "theme", "black" },
            { "singleSignOnDomains", new[] { "vanilla.intranet", "portal.intranet" } },
            { "scrollBehaviorEnabledCondition", enableScroll },
            { "useBrowserLanguage", true },
            { "idleModeCaptureEnabled", true },
            { "itemPathDisplayModeEnabled", true },
            { "browserPreferredCulture", "en-GB" },
            { "slotStyle", slotStyle },
            { "previousVisitCulture", "en-US" },
            { "epcot", new { accountMenuVersion = 6, headerVersion = 5 } },
            { "isPrerendered", true },
            { "crossDomainRegExG4", "/bwin.be/" },
            {
                "breakpoints", new Dictionary<string, string>
                {
                    { "sm", "screen" },
                    { "md", "md-screen" },
                }
            },
            { "singleSignOnLabels", new[] { "vanilla.intranet", "portal.intranet" } },
            { "hiddenLanguages", new[] { new { otherLang.Culture, otherLang.NativeName, otherLang.RouteValue } } },
            { "featureFlags", new Dictionary<string, bool>() { { "group", true } } },
            { "isLoginWithMobileEnabled", false },
        });
    }

    [Fact]
    public async Task ShouldNotReturnLoggingConfigurationIfTheFeatureIsNotEnabled()
    {
        globalJsErrorHandlerConfig.SetupGet(c => c.IsEnabled).Returns(false);
        globalJsErrorHandlerConfig.SetupGet(c => c.DebounceInterval).Throws(new Exception());
        globalJsErrorHandlerConfig.SetupGet(c => c.MaxErrorsPerBatch).Throws(new Exception());

        var config = await Target_GetConfigAsync();

        config["logging"].Should().BeEquivalentTo(new { isEnabled = false });
    }

    [Fact]
    public async Task HomePage_ShouldBeNullIfNoContent()
    {
        contentService.SetupWithAnyArgs(s => s.GetRequired<ILinkTemplate>(null, default)).Returns(() => null);

        var config = await Target_GetConfigAsync();

        config.Should().Contain("homePage", null);
    }
}
