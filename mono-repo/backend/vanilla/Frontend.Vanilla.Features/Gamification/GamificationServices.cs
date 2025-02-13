using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Gamification;

internal static class GamificationServices
{
    public static void AddGamificationFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IGamificationConfiguration, GamificationConfiguration>(GamificationConfiguration.FeatureName);
    }
}
