using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Frontend.Vanilla.Caching.Hekaton;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Caching.Tracing;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.AccountMenu;
using Frontend.Vanilla.Features.AntiForgery;
using Frontend.Vanilla.Features.ApiDocs;
using Frontend.Vanilla.Features.App;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.BalanceProperties;
using Frontend.Vanilla.Features.Cashier;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.ContentEndpoint;
using Frontend.Vanilla.Features.ContentMessages;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Cors;
using Frontend.Vanilla.Features.DeviceAtlas;
using Frontend.Vanilla.Features.Diagnostics;
using Frontend.Vanilla.Features.DomainSpecificActions;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Features.DynaConVariationContext;
using Frontend.Vanilla.Features.EdsGroup;
using Frontend.Vanilla.Features.EntryWeb.DataLayer;
using Frontend.Vanilla.Features.EntryWeb.Headers;
using Frontend.Vanilla.Features.EntryWeb.Prerender;
using Frontend.Vanilla.Features.EntryWeb.TopLevelDomainCookies;
using Frontend.Vanilla.Features.Games;
using Frontend.Vanilla.Features.Geolocation;
using Frontend.Vanilla.Features.GlobalErrorHandling;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Header;
using Frontend.Vanilla.Features.Hosting;
using Frontend.Vanilla.Features.HtmlInjection;
using Frontend.Vanilla.Features.Ioc;
using Frontend.Vanilla.Features.Json;
using Frontend.Vanilla.Features.LabelResolution;
using Frontend.Vanilla.Features.LicenseInfo;
using Frontend.Vanilla.Features.Logging;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.NativeApp;
using Frontend.Vanilla.Features.OpenTelemetry;
using Frontend.Vanilla.Features.PlaceholderReplacers;
using Frontend.Vanilla.Features.PublicPages;
using Frontend.Vanilla.Features.RangeDatepicker;
using Frontend.Vanilla.Features.ReCaptcha;
using Frontend.Vanilla.Features.SuspiciousRequest;
using Frontend.Vanilla.Features.TermsAndConditions;
using Frontend.Vanilla.Features.Theming;
using Frontend.Vanilla.Features.TrackerId;
using Frontend.Vanilla.Features.UI;
using Frontend.Vanilla.Features.UserBalance;
using Frontend.Vanilla.Features.UserScrub;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.Features.WebIntegration;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.ServiceClients;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features;

/// <summary>
/// Vanilla features.
/// </summary>
public static class VanillaFeaturesServices
{
    /// <summary>Discovers assemblies where are controllers to be mapped.</summary>
    private static IEnumerable<Assembly> DiscoverAssembliesWithControllers()
        => new[] { typeof(VanillaFeaturesServices).Assembly };

    private static void ConfigureControllers(IServiceCollection services)
    {
        var vanillaControllersAssembly = typeof(VanillaFeaturesServices).Assembly;
        var mvcBuilder = services.AddControllers().AddNewtonsoftJson();

        foreach (var assembly in DiscoverAssembliesWithControllers().Append(vanillaControllersAssembly))
            mvcBuilder.AddApplicationPart(assembly);

        mvcBuilder.AddControllersAsServices();
    }

    /// <summary>
    /// Adds Vanilla features for common API web app.
    /// </summary>
    public static IServiceCollection AddVanillaFeatures(this IServiceCollection services)
    {
        if (!services.TryMarkAsLoaded("Vanilla.Features.Api"))
            return services;

        // Dependencies
        services.AddVanillaServiceClients();
        services.AddVanillaDomainSpecificLanguage();
        services.AddVanillaSitecoreContent();
        services.AddVanillaDynaConConfigurationEngine();
        services.AddVanillaHekatonDistributedCache();

        // TODO: Move to VanillaCoreServices.cs once Hekaton is removed
        services.Decorate<IDistributedCache, EnvironmentIsolatedDistributedCache>();
        services.Decorate<IDistributedCache, MetricsDistributedCache>();
        services.Decorate<IDistributedCache, CompressedDistributedCache>();
        services.Decorate<IDistributedCache, TracedDistributedCache>();

        // .NET
        ConfigureControllers(services);
        services.AddResponseCompression(responseCompressionOptions =>
        {
            responseCompressionOptions.EnableForHttps = true;
            responseCompressionOptions.Providers.Add<BrotliCompressionProvider>();
            responseCompressionOptions.Providers.Add<GzipCompressionProvider>();
        });
        services.AddResponseCaching();

        /* Features, sorted alphabetically */
        services.AddAccountMenuFeature();
        services.AddAntiForgeryFeature();
        services.AddApiDocs();
        services.AddAppFeature();
        services.AddBalancePropertiesFeature();
        services.AddCashierFeature();
        services.AddClientConfigFeature();
        services.AddContentEndpointFeature();
        services.AddContentMessagesFeature();
        services.AddCookiesFeature();
        services.AddCorsFeature();
        services.AddDataLayerFeature();
        services.AddDeviceAtlasFeature();
        services.AddDiagnosticsFeature();
        services.AddDslProvidersFeature();
        services.AddDomainSpecificActionsFeature();
        services.AddDynaConVariationContextProvidersFeature();
        services.AddEdsGroupFeature();
        services.AddGamesFeature();
        services.AddGeolocationFeature();
        services.AddGlobalErrorHandlingFeature();
        services.AddGlobalizationFeature();
        services.AddHeaderFeature();
        services.AddHeadersFeature();
        services.AddHostingFeature();
        services.AddIocFeature();
        services.AddJsonFeature();
        services.AddLabelResolutionFeature();
        services.AddLicenseInfoFeature();
        services.AddLoginFeatureBase();
        services.AddLoginFeature(); // todo move to sfapi, integrate with httpclient
        services.AddLoggingFeature();
        services.AddNativeAppFeatureBase();
        services.AddPlaceholderReplacersFeature();
        services.AddPrerenderFeatureBase();
        services.AddPublicPagesFeature();
        services.AddRangeDatepickerFeature();
        services.AddReCaptchaFeatureBase();
        services.AddSingleton<ISitecoreLinkUrlProvider, SitecoreLinkUrlProvider>();
        services.AddSuspiciousRequestFeature();
        services.AddTermsAndConditionsFeature();
        services.AddThemingFeature();
        services.AddTrackerIdFeature();
        services.AddUiFeatureBase();
        services.AddUserBalanceFeatureBase();
        services.AddUserScrubFeature();
        services.AddVanillaAuthenticationServices();
        services.AddVisitorFeature();
        services.AddWebIntegrationFeature();
        services.AddWebUtilitiesFeature();
        services.AddEntryWebTopLevelDomainCookiesFeature();
        services.AddHtmlInjectionFeatureBase();
        services.AddOpenTelemetryFeature();
        /* Features, sorted alphabetically */

        return services;
    }
}
