using System.Linq;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.AccountMenu;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.ClientConfig;
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
using Frontend.Vanilla.Features.Theming;
using Frontend.Vanilla.Features.UI;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Page;

internal sealed class PageClientConfigProvider(
    ITrackingConfiguration trackingConfiguration,
    IEnvironmentProvider environmentProvider,
    ILanguageService languageService,
    IContentService contentService,
    ICookieConfiguration cookieConfiguration,
    IUserInterfaceConfiguration userInterfaceConfiguration,
    ICurrentProductResolver currentProductResolver,
    IAuthorizationConfiguration authorizationConfiguration,
    IAuthenticationConfiguration authenticationConfiguration,
    IGlobalJavascriptErrorHandlerConfiguration globalJsErrorHandlerConfig,
    ILoadingIndicatorConfiguration loadingIndicatorConfiguration,
    IProfilingConfiguration profilingConfiguration,
    IInternalRequestEvaluator internalRequestEvaluator,
    IThemeResolver themeResolver,
    IClientIPResolver clientIpResolver,
    IInactivityScreenConfiguration inactivityScreenConfiguration,
    IContentConfiguration contentConfiguration,
    IDynamicLayoutConfiguration dynamicLayoutConfiguration,
    IVisitorSettingsLanguageResolver visitorSettingsLanguageResolver,
    IHeaderConfiguration headerConfiguration,
    IAccountMenuConfiguration accountMenuConfiguration,
    IPrerenderDetector prerenderDetector,
    IHiddenLanguagesResolver hiddenLanguagesResolver,
    IFeatureFlagsConfiguration featureFlagsConfiguration,
    ILoginSettingsConfiguration loginConfig,
    ILogger<PageClientConfigProvider> log)
    : LambdaClientConfigProvider("vnPage", async cancellationToken =>
    {
        var requireTranslation = new ContentLoadOptions { RequireTranslation = true };
        var homePageTask =
            contentService.TryAsync(s => s.GetRequiredAsync<ILinkTemplate>(AppPlugin.ContentRoot + "/Links/Home", cancellationToken, requireTranslation), log);
        var loginUrlTask =
            contentService.TryAsync(s => s.GetRequiredAsync<ILinkTemplate>(AppPlugin.ContentRoot + "/Links/Login", cancellationToken, requireTranslation), log);
        var isInternal = internalRequestEvaluator.IsInternal();
        var clientIp = clientIpResolver.Resolve().ToString();
        var isPrerendered = prerenderDetector.IsRequestFromPrerenderService;
        var scrollBehaviorEnabledConditionTask = userInterfaceConfiguration.ScrollBehaviorEnabledCondition.EvaluateForClientAsync(cancellationToken);

        var currentLang = languageService.Current;
        var allowedLangs = languageService.Allowed;
        var hiddenLangs = hiddenLanguagesResolver.Resolve();
        const string loggerUrl = "/log"; // TODO remove in 2025

        return new
        {
            enableDsScrollbar = userInterfaceConfiguration.EnableDsScrollbar,
            htmlSourceTypeReplace = userInterfaceConfiguration.HtmlSourceTypeReplace,
            Lang = currentLang.RouteValue,
            LanguageCode = currentLang.Culture.TwoLetterISOLanguageName,
            HtmlLang = currentLang.HtmlLangAttribute,
            Culture = currentLang.Culture.Name,
            languageService.UseBrowserLanguage,
            languageService.BrowserPreferredCulture,
            Locale = currentLang.AngularLocale,
            Domain = cookieConfiguration.CurrentLabelDomain.Value,
            environmentProvider.IsProduction,
            environmentProvider.Environment,
            isInternal,
            clientIP = clientIp,
            DefaultLanguage = languageService.Default,
            UILanguages = allowedLangs.Select(l =>
                new
                {
                    l.Culture,
                    l.NativeName,
                    l.RouteValue,
                }),
            hiddenLanguages = hiddenLangs.Select(l => new
            {
                l.Culture,
                l.NativeName,
                l.RouteValue,
            }),
            Languages = allowedLangs.ConvertAll(l => l.RouteValue),
            HomePage = (await homePageTask)?.Url,
            LoginUrl = (await loginUrlTask)?.Url,
            Product = currentProductResolver.ProductLegacy, // TODO: remove when single domain migration is over
            authorizationConfiguration.IsAnonymousAccessRestricted,
            Logging = globalJsErrorHandlerConfig.IsEnabled
                ? (object)new
                {
                    isEnabled = globalJsErrorHandlerConfig.IsEnabled,
                    maxErrorsPerBatch = globalJsErrorHandlerConfig.MaxErrorsPerBatch,
                    debounceInterval = globalJsErrorHandlerConfig.DebounceInterval.TotalMilliseconds,
                    url = loggerUrl,
                    disableLogLevels = globalJsErrorHandlerConfig.DisableLogLevels,
                }
                : new { isEnabled = false, url = loggerUrl },
            LoadingIndicator = new
            {
                defaultDelay = loadingIndicatorConfiguration.DefaultDelay.TotalMilliseconds,
                externalNavigationDelay = loadingIndicatorConfiguration.ExternalNavigationDelay.TotalMilliseconds,
                spinnerContent = loadingIndicatorConfiguration.SpinnerContent,
                disabledUrlPattern = loadingIndicatorConfiguration.DisabledUrlPattern,
            },
            userInterfaceConfiguration.Currency,
            userInterfaceConfiguration.UserDisplayNameProperties,
            IsProfilingEnabled = profilingConfiguration.IsEnabled,
            isSingleDomainApp = false, // TODO: remove in 2025
            userInterfaceConfiguration.ImageProfiles,
            Cookies = new
            {
                sameSiteMode = cookieConfiguration.DefaultSameSiteMode,
                secure = cookieConfiguration.Secure,
            },
            scrollBehaviorEnabledCondition = await scrollBehaviorEnabledConditionTask,
            theme = themeResolver.GetTheme(),
            singleSignOnDomains = authenticationConfiguration.SingleSignOnDomains,
            idleModeCaptureEnabled = inactivityScreenConfiguration.Mode == "Betstation",
            contentConfiguration.ItemPathDisplayModeEnabled,
            dynamicLayoutConfiguration.SlotStyle,
            previousVisitCulture = visitorSettingsLanguageResolver.Resolve()?.Culture.Name,
            epcot = new
            {
                accountMenuVersion = accountMenuConfiguration.Version,
                headerVersion = headerConfiguration.Version,
            },
            isPrerendered,
            trackingConfiguration.CrossDomainRegExG4,
            userInterfaceConfiguration.Breakpoints,
            authenticationConfiguration.SingleSignOnLabels,
            featureFlagsConfiguration.FeatureFlags,
            loginConfig.IsLoginWithMobileEnabled,
        };
    })
{
    // Run tasks in parallel
}
