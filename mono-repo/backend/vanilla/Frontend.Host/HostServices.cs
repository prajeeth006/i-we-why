using Frontend.Host.Features.App;
using Frontend.Host.Features.Assets;
using Frontend.Host.Features.CanonicalLinkTag;
using Frontend.Host.Features.ClientApp;
using Frontend.Host.Features.ClientConfig;
using Frontend.Host.Features.EmailVerification;
using Frontend.Host.Features.FontPreload;
using Frontend.Host.Features.HtmlInjection;
using Frontend.Host.Features.HttpForwarding;
using Frontend.Host.Features.Index;
using Frontend.Host.Features.PageNotFound;
using Frontend.Host.Features.PartyTown;
using Frontend.Host.Features.Preloader;
using Frontend.Host.Features.Redirex;
using Frontend.Host.Features.Seo;
using Frontend.Host.Features.SeoTracking;
using Frontend.Host.Features.SignUpBonusRedirect;
using Frontend.Host.Features.SiteRootFiles;
using Frontend.Host.Features.SplashScreen;
using Frontend.Host.Features.StaticFiles;
using Frontend.Host.Features.StatusCode;
using Frontend.Host.Features.UrlTransformation;
using Frontend.Host.Features.WebAppMetadata;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features;
using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.DynaConVariationContext;
using Frontend.Vanilla.Features.EntryWeb.Prerender;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host;

/// <summary>Provides main entry point for Host DI services.</summary>
public static class HostServices
{
    /// <summary>Provides main entry point for defining Host services. Must be called from consuming application.</summary>
    public static void AddHostServices(this IServiceCollection services)
    {
        services.AddVanillaFeatures();

        // .NET
        services.AddMvc(options => { options.Filters.Add<WebApiAntiForgeryFilter>(); });

        // features
        services.AddSingleton(new DynaConParameter("service", "frontend-host:1"));
        services.AddSingleton<IDynaConVariationContextProvider>(p =>
            p.Create<DynaConVariationContextProviderAdapter>(p.Create<HostPathDynaConProvider>()));
        services.AddHttpForwardingFeature();
        services.AddPageNotFoundFeature();
        services.AddPrerenderFeatureHost();
        services.AddRedirexFeature();
        services.AddStatusCodeFeature();
        services.AddPrettyUrlsHostFeature();
        services.AddSeoHostFeature();
        services.AddEntryWebSeoTrackingFeature();
        services.AddSingleton<IWebpackDevServerConfiguration>(s =>
        {
            var configuration = s.GetRequiredService<IConfiguration>();
            var section = configuration.GetSection(nameof(WebpackDevServerConfiguration).RemoveSuffix("Configuration"));
            var url = section.Get<string>();

            return new WebpackDevServerConfiguration(url);
        });
        services.AddSingleton<IIndexViewDataProvider, IndexViewDataProvider>();
        services.AddClientAppFeature();
        services.AddClientConfigFeature();
        services.AddIndexFeature();
        services.AddSignUpBonusRedirectFeature();
        services.AddWebAppMetadataFeature();
        services.AddCanonicalLinkTagFeature();
        services.AddAppFeature();
        services.AddAssetsFeature();
        services.AddStaticFilesFeature();
        services.AddSplashScreenFeature();
        services.AddSiteRootFilesFeature();
        services.AddHtmlInjectionFeature();
        services.AddEmailVerificationFeature();
        services.AddPartyTownFeature();
        services.AddPreloaderFeature();
        services.AddFontPreloadFeature();
    }
}
