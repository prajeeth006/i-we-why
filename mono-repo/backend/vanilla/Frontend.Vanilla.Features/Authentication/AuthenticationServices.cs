using System;
using System.IO;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.Cookies;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Authentication;

internal static class AuthenticationServices
{
    public static void AddVanillaAuthenticationServices(this IServiceCollection services)
    {
        services.AddConfiguration<IAuthorizationConfiguration, AuthorizationConfiguration>(AuthorizationConfiguration.FeatureName);
        services.AddConfiguration<IAuthenticationConfiguration, AuthenticationConfiguration>(AuthenticationConfiguration.FeatureName);
        services.AddSingleton<IWebAuthenticationService, WebAuthenticationService>();
        services.AddSingleton<IAuthenticationHelper, AuthenticationHelper>();

        services.AddSingleton<IAuthenticatedClaimsInitializer, AuthenticatedClaimsInitializer>();
        services.AddSingleton<ICookieAuthenticationOptionsService, CookieAuthenticationOptionsService>();

        services.AddDataProtection().PersistKeysToFileSystem(
                new DirectoryInfo(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DataProtection")))
            .DisableAutomaticKeyGeneration()
            .SetApplicationName("FrontendApp"); // DO NOT CHANGE APPLICATION NAME - IT WILL BREAK AUTHENTICATION BETWEEN APPS
        services.Configure<CookieAuthenticationOptions, IServiceProvider>(
            CookieAuthenticationDefaults.AuthenticationScheme,
            (options, services) =>
            {
                var cookieConfig = services.GetRequiredService<ICookieConfiguration>();
                var authConfig = services.GetRequiredService<IAuthenticationConfiguration>();
                options.CookieManager = new CurrentLabelDomainCookieManager(new ChunkingCookieManager(), cookieConfig);

                var claimsInitializer = services.GetRequiredService<IAuthenticatedClaimsInitializer>();
                var cookieOptionsInitializer = services.GetRequiredService<ICookieAuthenticationOptionsService>();

                options.Events.OnValidatePrincipal = claimsInitializer.SetupClaimsAsync;
                options.Events.OnSigningIn = cookieOptionsInitializer.OverrideOnSigningIn;
                options.Events.OnSigningOut = cookieOptionsInitializer.OverrideOnSigningOut;
                options.Cookie.Name = CookieConstants.Auth;
                options.Cookie.SameSite = (SameSiteMode)cookieConfig.AuthCookieSameSiteMode;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.ExpireTimeSpan = authConfig.Timeout;
                options.SlidingExpiration = false;
                options.LoginPath = PathString.Empty;
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;

                    return Task.CompletedTask;
                };
            });

        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie();
    }
}
