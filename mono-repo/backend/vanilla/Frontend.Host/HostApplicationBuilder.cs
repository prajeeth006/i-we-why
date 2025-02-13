using Frontend.Host.Features.AuthRequired;
using Frontend.Host.Features.BrowserNotSupported;
using Frontend.Host.Features.EmailVerification;
using Frontend.Host.Features.Headers;
using Frontend.Host.Features.HttpForwarding;
using Frontend.Host.Features.PageNotFound;
using Frontend.Host.Features.PrettyUrls;
using Frontend.Host.Features.Redirex;
using Frontend.Host.Features.Seo;
using Frontend.Host.Features.SeoTracking;
using Frontend.Host.Features.SignUpBonusRedirect;
using Frontend.Host.Features.StaticFiles;
using Frontend.Host.Features.StatusCode;
using Frontend.Host.Features.SuspiciousRequest;
using Frontend.Host.Features.UrlTransformation;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features;
using Frontend.Vanilla.Features.Claims;
using Frontend.Vanilla.Features.DomainSpecificActions;
using Frontend.Vanilla.Features.EntryWeb.Headers;
using Frontend.Vanilla.Features.EntryWeb.Prerender;
using Frontend.Vanilla.Features.LicenseInfo;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.Middleware;
using Frontend.Vanilla.Features.RememberMe;
using Frontend.Vanilla.Features.Visit;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host;

/// <summary>Main entry point for host application builder.</summary>
public static class HostApplicationBuilder
{
    /// <summary>Uses vanilla host-application-specific features. Must!!! be used in consuming application(s).</summary>
    public static async Task UseHostFeaturesAsync(
        this WebApplication app,
        Action<IApplicationBuilder>? configureAppBeforeRouting = null,
        Action<IApplicationBuilder>? configureApp = null,
        Action<IEndpointRouteBuilder>? configureEndpoints = null)
    {
        await app.UseVanillaFeaturesAsync(
            configureAppBeforeRouting: appBuilder =>
            {
                var environmentProvider = appBuilder.ApplicationServices.GetRequiredService<IEnvironmentProvider>();
                appBuilder.UseWhen(c => environmentProvider.IsProduction is false &&
                                        c.Request.Headers.ContainsKey(ProductApiProxyMiddleware.EnableHeader) &&
                                        c.Request.Path.Value?.Contains(ProductApiProxyMiddleware.ProductApiPathInfix) == true,
                    b => b.UseMiddleware<ProductApiProxyMiddleware>());
                appBuilder.UseHostStaticFiles();
                configureAppBeforeRouting?.Invoke(appBuilder);
            },
            configureApp: appBuilder =>
            {
                appBuilder.UseMiddleware<RedirexMiddleware>();
                appBuilder.UseMiddleware<PrerenderMiddleware>();
                appBuilder.UseMiddleware<ResponseHeadersMiddleware>();
                appBuilder.UseMiddleware<DynamicLinkResponseHeaderMiddleware>();
                appBuilder.UseMiddleware<PageNotFoundMiddleware>();
                appBuilder.UseMiddleware<StatusCodeMiddleware>();
                appBuilder.UseMiddleware<BrowserNotSupportedMiddleware>();
                appBuilder.UseMiddleware<SuspiciousRequestMiddleware>();
                appBuilder.UseMiddleware<SignUpBonusRedirectMiddleware>();
                appBuilder.UseMiddleware<AutoLoginMiddleware<AutoLoginWithSsoTokenHandler>>();
                appBuilder.UseMiddleware<AutoLoginMiddleware<AutoLoginWithUsernameAndPasswordHandler>>();
                appBuilder.UseMiddleware<AutoLoginMiddleware<AutoLoginWithTempTokenHandler>>();
                appBuilder.UseMiddleware<AuthRequiredMiddleware>();
                appBuilder.UseMiddleware<ClaimRedirectMiddleware>();
                appBuilder.UseMiddleware<PosApiMapQueryMiddleware>();
                appBuilder.UseMiddleware<LicenseInfoMiddleware>();
                appBuilder.UseMiddleware<SeoTrackingMiddleware>();
                appBuilder.UseMiddleware<SsoCookieMiddleware>();
                appBuilder.UseMiddleware<WorkflowIdMiddleware>();
                appBuilder.UseMiddleware<DomainSpecificActionsMiddleware>();
                appBuilder.UseMiddleware<VisitTrackingMiddleware>();
                appBuilder.UseWhen(c => c.Request.Path.Value?.IndexOf(EmailVerificationMiddleware.EmailVerificationRoute) > -1, b => b.UseMiddleware<EmailVerificationMiddleware>());
                appBuilder.UseMiddleware<PrettyUrlsHostMiddleware>();
                appBuilder.UseMiddleware<SeoHostMiddleware>();

                configureApp?.Invoke(appBuilder);
            },
            configureEndpoints: endpoints =>
            {
                configureEndpoints?.Invoke(endpoints);
                endpoints.MapHostEndpoints();
            });
    }
}
