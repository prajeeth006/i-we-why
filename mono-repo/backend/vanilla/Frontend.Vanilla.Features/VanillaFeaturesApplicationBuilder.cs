using System;
using System.Net;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features.ApiDocs;
using Frontend.Vanilla.Features.AppBuilder;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Diagnostics;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.AssetsHandling;
using Frontend.Vanilla.Features.Diagnostics.ServerTiming;
using Frontend.Vanilla.Features.Diagnostics.SiteCheck;
using Frontend.Vanilla.Features.Diagnostics.SiteVersion;
using Frontend.Vanilla.Features.Diagnostics.SiteVersionXml;
using Frontend.Vanilla.Features.EntryWeb.TopLevelDomainCookies;
using Frontend.Vanilla.Features.GlobalErrorHandling;
using Frontend.Vanilla.Features.Globalization.Middlewares;
using Frontend.Vanilla.Features.Logging;
using Frontend.Vanilla.Features.ResponseCompression;
using Frontend.Vanilla.Features.WebIntegration.Core;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.ResponseCaching;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Net.Http.Headers;
using Serilog;

namespace Frontend.Vanilla.Features;

/// <summary>
/// Common logic for  class for startups of Vanilla apps.
/// </summary>
public static class VanillaFeaturesApplicationBuilder
{
    /// <summary>Used to add common vanilla features regardless of application type (api vs host).</summary>
    /// <param name="app"></param>
    /// <param name="configureAppBeforeRouting">Provides configuring of app before UseRouting() call.</param>
    /// <param name="configureApp">Provides configuring of app.</param>
    /// <param name="configureEndpoints">Provides ability to configure endpoints.</param>
    public static async Task UseVanillaFeaturesAsync(
        this WebApplication app,
        Action<IApplicationBuilder>? configureAppBeforeRouting = null,
        Action<IApplicationBuilder>? configureApp = null,
        Action<IEndpointRouteBuilder>? configureEndpoints = null)
    {
        var log = InitializeLogging(app);

        var initializer = app.Services.Create<VanillaAppInitializer>();
        await initializer.InitializeAsync(log);

        app.UseExceptionHandling();
        app.UseVanillaResponseCompression();

        app.UseMiddleware<AllowOnlyInternalAccessMiddleware>();
        app.UseMiddleware<ServerTimingMiddleware>();
        app.UseMiddleware<GlobalErrorHandlingMiddleware>();
        app.UseMiddleware<DiagnosticsResponseHeaderMiddleware>();
        app.UseMiddleware<SiteCheckMiddleware>();
        app.UseMiddleware<SiteVersionMiddleware>();
        app.UseMiddleware<SiteVersionXmlMiddleware>();
        app.UseMiddleware<HealthAssetsMiddleware>(typeof(HealthAssetsMiddleware).Assembly,
            new RelativePath("SpaFiles.wwwroot.health"));
        app.UseMiddleware<DefaultLanguageMiddleware>();
        app.UseApiDocs();
        configureAppBeforeRouting?.Invoke(app);
        app.UseRouting();
        // request to /metrics should not go through middlewares after
        app.MapWhen(c => c.Request.Path == "/metrics" && c.RequestServices.GetRequiredService<IInternalRequestEvaluator>().IsInternal(), b =>
            b.UseEndpoints(a =>
                a.MapPrometheusScrapingEndpoint()));
        app.UseMiddleware<NotFoundIfNoEndpointMiddleware>();

        app.UseCors();
        app.UseAuthentication();
        app.UseMiddleware<AnonymousClaimsMiddleware>();
        app.UseAuthorization();

        app.UseResponseCaching();
        UseDefaultNoCacheResponseHeaders(app);

        app.UseMiddleware<TopLevelDomainCookiesCleanupMiddleware>();
        app.UseMiddleware<LanguageResolutionMiddleware>();
        app.UseMiddleware<VisitorSettingsCultureMiddleware>();
        app.UseMiddleware<LanguageCookieMiddleware>();
        app.UseMiddleware<WebAppContextSwitchMiddleware>();

        configureApp?.Invoke(app);

        app.MapDiagnosticApiEndpoints();
        app.MapControllers();
        configureEndpoints?.Invoke(app);
    }

    private static ILogger InitializeLogging(IApplicationBuilder app)
    {
        var configurations = app.ApplicationServices.Create<LoggingOptionsSetup>();
        var loggingOptions = new LoggingOptions();
        configurations.Configure(loggingOptions);
        var log = loggingOptions.Logger
                  ?? throw new Exception("Failed setting up semantic logging.");

        return log;
    }

    private static void UseDefaultNoCacheResponseHeaders(IApplicationBuilder app)
    {
        app.Use(async (context, next) =>
        {
            var responseCachingFeature = context.Features.Get<IResponseCachingFeature>();

            if (responseCachingFeature != null)
            {
                responseCachingFeature.VaryByQueryKeys = new[] { "*" };
            }

            context.Response.OnStarting(() =>
            {
                if (context.Response.GetTypedHeaders().CacheControl == null &&
                    (context.Response.StatusCode != (int)HttpStatusCode.Moved &&
                    context.Response.StatusCode != (int)HttpStatusCode.Redirect))
                {
                    context.Response.GetTypedHeaders().CacheControl =
                        new CacheControlHeaderValue()
                        {
                            NoCache = true,
                            NoStore = true,
                            MustRevalidate = true,
                        };

                    context.Response.Headers[HeaderNames.Vary] = new[] { "Accept-Encoding" };
                }

                return Task.FromResult(0);
            });

            await next();
        });
    }
}
