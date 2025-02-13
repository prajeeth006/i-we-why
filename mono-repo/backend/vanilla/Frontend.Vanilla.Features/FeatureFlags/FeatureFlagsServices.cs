using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.FeatureFlags;

internal static class FeatureFlagsServices
{
    public static void AddFeatureFlagsFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IFeatureFlagsConfiguration, FeatureFlagsConfiguration>(FeatureFlagsConfiguration.FeatureName);
    }
}
