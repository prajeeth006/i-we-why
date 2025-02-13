using System.Net;
using System.Text.Encodings.Web;
using Frontend.Host.Features.Assets;
using Frontend.Host.Features.CanonicalLinkTag;
using Frontend.Host.Features.HtmlInjection;
using Frontend.Host.Features.PartyTown;
using Frontend.Host.Features.SplashScreen;
using Frontend.Host.Features.WebAppMetadata;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features;
using Frontend.Vanilla.Features.EntryWeb.DataLayer;
using Frontend.Vanilla.Features.EntryWeb.DataLayer.TagManagers;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.HtmlInjection;
using Frontend.Vanilla.Features.UI;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using Frontend.Host.Features.ClientConfig;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Host.Features.Preloader;
using Frontend.Host.Features.FontPreload;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Frontend.Host;

/// <summary>
/// Provides data for Index view.
/// </summary>
public interface IIndexViewDataProvider
{
    HtmlString RenderCurrentVersion();
    Task<HtmlString> RenderClientConfigScriptAsync(HttpContext httpContext);

    /// <summary>Returns page title.</summary>
    Task<string> GetTitleAsync(HttpContext httpContext);

    /// <summary>Returns html lang attribute value.</summary>
    string GetHtmlLang();

    /// <summary>Returns current major version.</summary>
    int MajorVersion { get; }

    /// <summary>Description.</summary>
    string? Description { get; set; }

    /// <summary>Returns no script message.</summary>
    Task<string> GetRequiredJavaScriptMessageAsync(CancellationToken cancellationToken);

    /// <summary>Returns viewport info.</summary>
    string GetViewport();

    /// <summary>Renders canonical link tags.</summary>
    HtmlString RenderCanonicalLinkTag(HttpContext httpContext);

    /// <summary>Renders preloader.js.</summary>
    Task<HtmlString> RenderPreloaderAsync(CancellationToken cancellationToken);

    /// <summary>Renders font preload.</summary>
    Task<HtmlString> RenderFontPreloadAsync(CancellationToken cancellationToken);

    /// <summary>Renders splash screen.</summary>
    Task<HtmlString> RenderSplashScreenAsync(CancellationToken cancellationToken);

    /// <summary>Renders time stamp.</summary>
    HtmlString RenderCurrentTime();

    /// <summary>Renders bootstrap assets.</summary>
    Task<HtmlString> RenderBootstrapAssetsAsync(BootstrapAssetSection section, CancellationToken cancellationToken);

    /// <summary>Renders sitecore scripts.</summary>
    Task<HtmlString> RenderSiteScriptsAsync(SiteScriptsPosition position, CancellationToken cancellationToken);

    /// <summary>Renders delayed script tags.</summary>
    Task<HtmlString> RenderDelayedScriptTagsAsync(CancellationToken token);

    /// <summary>Renders delayed script tags.</summary>
    Task<HtmlString> RenderWebAppMetadataAsync(CancellationToken cancellationToken);

    /// <summary>Renders delayed script tags.</summary>
    HtmlString RenderAbTestingScript();

    /// <summary>Renders delayed script tags.</summary>
    Task<HtmlString> RenderHtmlHeadTagsFromDynaconAsync(CancellationToken token);

    /// <summary>Renders delayed script tags.</summary>
    Task<HtmlString> RenderHtmlHeadTagsFromSitecoreAsync(CancellationToken cancellationToken);

    /// <summary>Renders delayed script tags.</summary>
    HtmlString RenderDataLayer();

    /// <summary>Renders delayed script tags.</summary>
    HtmlString RenderTagManagers(bool skipClientInjectionConfigCheck = false);

    /// <summary>Renders party town script.</summary>
    HtmlString RenderPartyTownScripts();
}

internal sealed class IndexViewDataProvider(
    ISiteScriptsRenderer siteScriptsRenderer,
    IEnumerable<ITagManager> tagManagers,
    IDataLayerRenderer dataLayerRenderer,
    ISitecoreHeadTagsRenderer sitecoreHeadTagsRenderer,
    IHeadTagsRenderer headTagsRenderer,
    IHtmlInjectionControlOverride htmlInjectionControlOverride,
    ITrackingConfiguration trackingConfiguration,
    IWebAppMetadataRenderer webAppMetadataRenderer,
    IFooterScriptTagsRenderer footerScriptTagsRenderer,
    IBootstrapAssetsRenderer bootstrapAssetsRenderer,
    IContentService contentService,
    ISplashScreenConfiguration splashScreenConfiguration,
    ICanonicalLinkTagService canonicalLinkTagService,
    IUserInterfaceConfiguration userInterfaceConfiguration,
    ILanguageService languageService,
    VanillaVersion vanillaVersion,
    IPartyTownConfiguration partyTownConfiguration,
    IDynaConParameterExtractor dynaConParameterExtractor,
    IClientConfigConfiguration clientConfigConfiguration,
    IEagerClientConfigService eagerClientConfigService,
    IPreloaderConfiguration preloaderConfiguration,
    IBootstrapAssetsContext bootstrapAssetsContext,
    IFontPreloadConfiguration fontPreloadConfiguration,
    IEpcotDslProvider epcotDslProvider,
    IWebHostEnvironment webHostEnvironment,
    IEnvironmentProvider environmentProvider,
    ILogger<IndexViewDataProvider> log)
    : IIndexViewDataProvider
{
    private const string EpcotHeaderFeatureName = "header";

    private static readonly JsonSerializerOptions CamelCaseNamingJsonSerializerOptions = new ()
        { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    private static readonly JsonSerializerOptions CompactJsonSerializerOptions = new ()
        { WriteIndented = false };

    private readonly string fontsFolder = Path.Combine(webHostEnvironment.ContentRootPath, "ClientDist/assets/fonts");

    private HtmlString? vanillaVersionValue;

    public HtmlString RenderPartyTownScripts()
    {
        return !partyTownConfiguration.IsEnabled
            ? HtmlString.Empty
            : new HtmlString($$"""
                               <script type="text/javascript">
                                    window._ptEnabled = true;
                                    if ('serviceWorker' in navigator) {
                                        partytown = {
                                           forward: {{partyTownConfiguration.ForwardedFunctionCalls}},
                                           lib: '/ClientDist/~partytown/',
                                           debug: {{JsonSerializer.Serialize(partyTownConfiguration.EnableDebugMode)}},
                                           globalFns: {{JsonSerializer.Serialize(partyTownConfiguration.GlobalFns)}},
                                           logSendBeaconRequests: {{JsonSerializer.Serialize(partyTownConfiguration.LogSendBeaconRequests)}},
                                           logStackTraces: {{JsonSerializer.Serialize(partyTownConfiguration.LogStackTraces)}},
                                           loadScriptsOnMainThread: {{JsonSerializer.Serialize(partyTownConfiguration.ScriptsOnMainThread)}},
                                           logGetters: {{JsonSerializer.Serialize(partyTownConfiguration.LogGetters)}},
                                           logSetters: {{JsonSerializer.Serialize(partyTownConfiguration.LogSetters)}},
                                           get: function(options) {
                                                
                                                // options.name is just the property, without any further information
                                                // in case there is a nodeName (e.g `#document`) we will get `document.height`
                                                // in case there is no nodeName (e.g `Screen`) we will take the `constructor` to get `screen.height`
                                                const name = `${options.nodeName ? options.nodeName.replace('#','').toLowerCase() : options.constructor.toLowerCase()}.${options.name}`;
                                                if (options.window.ptSharedStorage?.has(name)) {
                                                    return options.window.ptSharedStorage.get(name);
                                                }
                                                
                                                return options.continue;
                                           },
                                           resolveSendBeaconRequestParameters: function(url) {
                                               const setKeepAliveToFalseHosts = {{JsonSerializer.Serialize(partyTownConfiguration.IgnoreKeepAliveBeaconHosts)}};
                                               if (setKeepAliveToFalseHosts.some(host => url.hostname.includes(host))) {
                                                   return { keepalive: false };
                                               }
                                           },
                                           resolveUrl: function(url, location, type) {
                                               const proxiedHosts = {{JsonSerializer.Serialize(partyTownConfiguration.ProxiedHosts)}};
                                       
                                               const ignoreScriptConstraintRequest = ['doubleclick.net'];
                                       
                                               const properType = type === 'script' || ignoreScriptConstraintRequest.some(host => url.hostname.endsWith(host));
                                               if (properType && proxiedHosts.some(host => url.hostname.endsWith(host))) {
                                                   const proxyUrl = new URL(`${location.origin}/reverse-proxy`);
                                                   proxyUrl.searchParams.append('url', url.href);
                                                   return proxyUrl;
                                               }
                                               return url;
                                           },
                                           enableEventReplay: {{JsonSerializer.Serialize(partyTownConfiguration.EnableEventReplay)}},
                                           fallbackTimeout: {{partyTownConfiguration.FallbackTimeout}},
                                           swPath: '{{partyTownConfiguration.ServiceWorkerPath}}' || undefined
                                       };
                               
                                    }
                               </script>

                               <script type="text/partytown" ptScope="worker">(function(){
                                    window.global = document;
                                    const ptStorage = {};
                                    window.ptSharedStorage = window.ptSharedStorage ?? {
                                        set: (key, value) => {
                                            ptStorage[key] = value;
                                        },
                                        get: (key) => {
                                            return ptStorage[key];
                                        },
                                        has: (key) => {
                                            return key in ptStorage;
                                        }
                                    }
                                    // make sure routes are forwarded
                                    window.ptWorkerLocation = window.ptWorkerLocation ?? {
                                        set: (loc) => {},
                                    };
                                    const workerLocation = window.ptWorkerLocation;
                                    const origSet = workerLocation.set;
                                    let appLocation = {
                                        hash: window.location.hash,
                                        protocol: window.location.protocol,
                                        host: window.location.host,
                                        hostname: window.location.hostname,
                                        href: window.location.href,
                                        origin: window.location.origin,
                                        pathname: window.location.pathname,
                                        port: window.location.port,
                                        search: window.location.search
                                    };
                                    Object.defineProperty(window, 'location', {
                                        get: () => {
                                            return appLocation;
                                        },
                                        set: () => void 0
                                    });
                                    Object.defineProperty(document, 'location', {
                                        get: () => {
                                            return appLocation;
                                        },
                                        set: () => void 0
                                    });
                                    workerLocation.set = (...args) => {
                                        const {
                                            hash,
                                            href,
                                            pathname,
                                            search
                                        } = args[0];
                                        appLocation.href = href;
                                        appLocation.hash = hash;
                                        appLocation.pathname = pathname;
                                        appLocation.search = search;
                                        return origSet.bind(workerLocation, ...args)();
                                    }
                               })();</script>

                               <script type="text/partytown" ptScope="worker">
                                   (function() {
                                        if (dataLayer?.push) {
                                            const _origPush = dataLayer.push;
                                            dataLayer.push = (...args) => {
                                                const result = _origPush.apply(dataLayer, args);
                                       
                                                try {
                                                    const savedEventsItem = localStorage.getItem('_ptEventsQueue');
                                                    const eventsQueue = savedEventsItem ? JSON.parse(savedEventsItem) : [];
                                                    const stringifiedArgs = JSON.stringify(args);
                                                    const indexToRemove = eventsQueue.findIndex(item => item === stringifiedArgs);
                                                    if (indexToRemove > -1) {
                                                        eventsQueue.splice(indexToRemove, 1);
                                                        localStorage.setItem('_ptEventsQueue', JSON.stringify(eventsQueue));
                                                    }
                                                } catch (e) {
                                                    console.error('Failed to remove event from queue: ', e);
                                                }
                                       
                                                return result;
                                            }
                                        }
                                   })();
                               </script>

                               <script type="text/javascript">
                                    if('serviceWorker' in navigator) {
                                        const script = document.createElement('script');
                                        script.src = `/ClientDist/~partytown/{{(partyTownConfiguration.EnableDebugMode ? "debug/" : string.Empty)}}partytown.js`;
                                        const fallbackTimeout = {{partyTownConfiguration.FallbackTimeout}};
                                        window._ptReady = new Promise((resolve, reject) => {
                                            let started = false;
                                            function startTimer() {
                                              if (!started) {
                                                started = true;
                                                const rejectTimer = setTimeout(() => {
                                                    reject();
                                                }, fallbackTimeout + 1000);
                                                document.addEventListener('pt0', () => {
                                                    clearTimeout(rejectTimer);
                                                    resolve();
                                                });
                                              }
                                            }
                                            if (document.readyState == 'complete') {
                                                startTimer();
                                            } else {
                                                window.addEventListener('DOMContentLoaded', startTimer);
                                                window.addEventListener('load', startTimer);
                                            }
                                        });
                                        document.head.appendChild(script);
                                    }
                               </script>
                               """);
    }

    public HtmlString RenderCurrentVersion()
    {
        if (vanillaVersionValue is not null) return vanillaVersionValue;

        vanillaVersionValue = new HtmlString($"window.VERSION='{vanillaVersion}';{(environmentProvider.IsSingleDomainApp ? "window.SINGLE_DOMAIN='1';" : string.Empty)}");

        return vanillaVersionValue;
    }

    public async Task<HtmlString> RenderClientConfigScriptAsync(HttpContext httpContext)
    {
        var endpoints = JsonSerializer.Serialize(eagerClientConfigService.GetClientConfigEndpoints(httpContext),
            CamelCaseNamingJsonSerializerOptions);
        if (clientConfigConfiguration.Version == 2)
        {
            var clientConfigsServerTimings = await eagerClientConfigService.GetConfigsAndServerTimingsAsync(httpContext);
            httpContext.Response.Headers.Append(HttpHeaders.ServerTiming, clientConfigsServerTimings.Item2.Join(","));

            return new HtmlString(
                $"window['_boot']=Promise.resolve();window['_endpoints'] = Object.entries({endpoints});window.clientConfig={JsonConvert.SerializeObject(clientConfigsServerTimings.Item1)};");
        }

        return new HtmlString(
            $$"""
              function getCookie(name) {
                      const value = `; ${document.cookie}`;
                      const parts = value.split(`; ${name}=`);
                      if (parts.length === 2) return parts.pop().split(';').shift();
              }
              function load(endpoint) {
                  const lang = getCookie('lang') || 'en';
                  const headers = {
                      'x-bwin-browser-url': location.href,
                      'x-bwin-browser-referrer': document.referrer,
                      'X-App-Context': self === top ? 'default' : 'iframe',
                      'X-From-Product': '{{dynaConParameterExtractor.Product}}',
                  };
                  if (endpoint[1].header) {
                    headers[`x-bwin-${endpoint[0]}-api`] = endpoint[1].header;
                  }
                  return fetch(`${(endpoint[1].url ? endpoint[1].url : '')}/${lang}/api/clientconfig`, {
                      cache: 'no-store',
                      headers: headers,
                      credentials: 'include'
                  })
                      .then(res => res.json())
                      .then(config => { window['clientConfig'] = window['clientConfig'] || {}; Object.assign(window['clientConfig'], config); })
                      .catch(err => console.error(endpoint, err));
              }
              function boot() {
                  window['_endpoints'] = Object.entries({{endpoints}});
                  return Promise.all(window['_endpoints'].map(endpoint => load(endpoint)));
              }
              window['_boot'] = boot();
              """);
    }

    public int MajorVersion { get; } = vanillaVersion.Version.Major;

    public async Task<string> GetTitleAsync(HttpContext httpContext)
    {
        var title = await contentService.TryAsync(
            s => s.GetRequiredStringAsync<ISiteRoot>("/", r => r.DefaultPageTitle, httpContext.RequestAborted), log);

        return title ?? httpContext.Request.GetFullUrl().Host;
    }

    public string GetHtmlLang() => languageService.Current.HtmlLangAttribute;

    public string? Description { get; set; }

    public async Task<string> GetRequiredJavaScriptMessageAsync(CancellationToken cancellationToken)
    {
        var message = await contentService.TryAsync(s => s.GetRequiredStringAsync<IViewTemplate>(AppPlugin.ContentRoot + "/Header/JavaScriptRequired",
            t => t.Text,
            cancellationToken), log);

        return message ?? "Your browser does not support JavaScript!";
    }

    public string GetViewport() => userInterfaceConfiguration.Viewport;

    public HtmlString RenderCanonicalLinkTag(HttpContext httpContext)
    {
        var url = httpContext.Request.GetFullUrl();
        var tag = canonicalLinkTagService.Render(url);

        return new HtmlString(tag);
    }

    public async Task<HtmlString> RenderPreloaderAsync(CancellationToken cancellationToken)
    {
        if (!preloaderConfiguration.IsEnabled)
        {
            return HtmlString.Empty;
        }

        var manifestFilePath = await bootstrapAssetsContext.WebpackFileAsync(preloaderConfiguration.ManifestKey, cancellationToken);

        var script = new TagBuilder("script");
        script.Attributes.Add("src", manifestFilePath);

        await using var writer = new StringWriter();
        script.WriteTo(writer, HtmlEncoder.Default);

        return new HtmlString(writer.ToString());
    }

    public async Task<HtmlString> RenderFontPreloadAsync(CancellationToken cancellationToken)
    {
        if (!fontPreloadConfiguration.IsEnabled)
        {
            return HtmlString.Empty;
        }

        var searchPattern = $"{(epcotDslProvider.IsEnabled(EpcotHeaderFeatureName) ? "epcot" : string.Empty)}{fontPreloadConfiguration.NameSearchPatternPrefix}*.woff2";

        try
        {
            var fileName = Directory.GetFiles(fontsFolder, searchPattern).FirstOrDefault();

            if (fileName is null)
            {
                return HtmlString.Empty;
            }

            var filePath = Path.GetFileName(fileName);

            var script = new TagBuilder("link");
            script.Attributes.Add("rel", "preload");
            script.Attributes.Add("as", "font");
            script.Attributes.Add("crossorigin", "anonymous");
            script.Attributes.Add("href", $"ClientDist/assets/fonts/{filePath}");

            await using var writer = new StringWriter();
            script.WriteTo(writer, HtmlEncoder.Default);

            return new HtmlString(writer.ToString());
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Unable to locate file using {searchPattern}", searchPattern);
        }

        return HtmlString.Empty;
    }

    public async Task<HtmlString> RenderSplashScreenAsync(CancellationToken cancellationToken)
    {
        try
        {
            if (!await splashScreenConfiguration.IsEnabled.EvaluateAsync(cancellationToken))
            {
                return HtmlString.Empty;
            }

            var content = await contentService.GetAsync<IViewTemplate>("App-v1.0/SplashScreen/Content", cancellationToken);

            return content?.Text == null ? HtmlString.Empty : new HtmlString(content.Text);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed rendering splash screen");

            return HtmlString.Empty;
        }
    }

    public HtmlString RenderCurrentTime()
    {
        var script = new TagBuilder("script");
        script.InnerHtml.Append($"window.__rendered = new Date({((DateTimeOffset)DateTime.UtcNow).ToUnixTimeSeconds() * 1000});");

        using var writer = new StringWriter();
        script.WriteTo(writer, HtmlEncoder.Default);

        return new HtmlString(writer.ToString());
    }

    public async Task<HtmlString> RenderBootstrapAssetsAsync(BootstrapAssetSection section, CancellationToken cancellationToken) =>
        new (await bootstrapAssetsRenderer.RenderAsync(section, cancellationToken));

    public async Task<HtmlString> RenderSiteScriptsAsync(SiteScriptsPosition position, CancellationToken cancellationToken)
    {
        try
        {
            return new HtmlString(await siteScriptsRenderer.RenderAsync(position, cancellationToken));
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Loading of ALL {Position} SiteScripts failed", position);

            return HtmlString.Empty;
        }
    }

    public async Task<HtmlString> RenderDelayedScriptTagsAsync(CancellationToken token)
    {
        var renderedText = await footerScriptTagsRenderer.RenderAsync(token);

        return new HtmlString(renderedText);
    }

    public async Task<HtmlString> RenderWebAppMetadataAsync(CancellationToken cancellationToken) => new (await webAppMetadataRenderer.RenderAsync(cancellationToken));

    public HtmlString RenderAbTestingScript()
    {
        if (!trackingConfiguration.AbTestingIsEnabled || string.IsNullOrWhiteSpace(trackingConfiguration.AbTestingScriptSource) ||
            htmlInjectionControlOverride.IsDisabled(HtmlInjectionKind.AbTesting))
            return HtmlString.Empty;

        var tag = new TagBuilder("script");
        tag.MergeAttribute("src", trackingConfiguration.AbTestingScriptSource);
        tag.MergeAttribute("type", "text/javascript");

        using var writer = new StringWriter();
        tag.WriteTo(writer, HtmlEncoder.Default);

        return new HtmlString(WebUtility.HtmlDecode(writer.ToString()));
    }

    public async Task<HtmlString> RenderHtmlHeadTagsFromDynaconAsync(CancellationToken token)
    {
        var renderedText = await headTagsRenderer.RenderAsync(token);

        return new HtmlString(renderedText);
    }

    public async Task<HtmlString> RenderHtmlHeadTagsFromSitecoreAsync(CancellationToken cancellationToken) =>
        new (await sitecoreHeadTagsRenderer.RenderAsync(cancellationToken));

    public HtmlString RenderDataLayer() => tagManagers.Any(m => m.IsEnabled) ? new HtmlString(dataLayerRenderer.GetDataLayerMarkup()) : HtmlString.Empty;

    public HtmlString RenderTagManagers(bool skipClientInjectionConfigCheck = false) =>
        new (string.Concat(tagManagers.Where(m => m.IsEnabled).Select(m => m.RenderBootstrapScript(skipClientInjectionConfigCheck))));
}
