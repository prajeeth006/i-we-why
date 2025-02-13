using System;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Features.App;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Cookies;

internal static class CookiesServices
{
    public static void AddCookiesFeature(this IServiceCollection services)
    {
        // Config
        services.AddSingleton<ICookieConfiguration>(p => new CookieConfiguration(
            p.GetRequiredService<IEnvironmentProvider>(),
            () => p.Create<CookieSameSiteProvider>(),
            p.GetRequiredService<IAppConfiguration>));
        services.AddConfiguration<IDynaConCookieConfiguration, DynaConCookieConfiguration>(DynaConCookieConfiguration.FeatureName);
        services.AddSingleton<ICookiePartitionedStateProvider, CookiePartitionedStateProvider>();
        services.AddSingleton<Func<ICookiePartitionedStateProvider>>(c => c.GetRequiredService<ICookiePartitionedStateProvider>);

        // Diagnostics
        services.AddSingleton<IDiagnosticInfoProvider, CookiesDiagnosticProvider>();

        // JSON
        services.AddSingleton<ICookieJsonHandler, CookieJsonHandler>();
    }
}
