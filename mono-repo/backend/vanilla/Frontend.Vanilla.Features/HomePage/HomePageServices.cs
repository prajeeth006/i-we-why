using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.HomePage;

internal static class HomePageServices
{
    public static void AddHomePageFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IHomePageConfiguration, HomePageConfiguration>(HomePageConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, HomePageClientConfigProvider>();
    }
}
