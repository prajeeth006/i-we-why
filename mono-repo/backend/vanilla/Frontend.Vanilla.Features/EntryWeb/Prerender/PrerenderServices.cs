using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.EntryWeb.Prerender;

internal static class PrerenderServices
{
    public static void AddPrerenderFeatureBase(this IServiceCollection services)
    {
        services.AddConfiguration<IPrerenderConfiguration, PrerenderConfiguration>(PrerenderConfiguration.FeatureName);
        services.AddSingleton<IPrerenderService, PrerenderService>();
        services.AddSingleton<IPrerenderDetector, PrerenderDetector>();
    }

    public static void AddPrerenderFeatureSfapi(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, PrerenderClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, PrerenderFeatureEnablementProvider>();
    }

    public static void AddPrerenderFeatureHost(this IServiceCollection services)
    {
        services.AddSingleton<IHealthCheck, PrerenderHealthCheck>(InjectedArgument.CreateFuncArgument<IPrerenderConfiguration>());
    }
}
