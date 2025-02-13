using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.SplashScreen;

internal static class SplashScreenServices
{
    public static void AddSplashScreenFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ISplashScreenConfiguration, SplashScreenConfiguration>(SplashScreenConfiguration.FeatureName);
    }
}
