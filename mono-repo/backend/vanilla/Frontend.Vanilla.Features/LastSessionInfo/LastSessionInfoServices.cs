using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.LastSessionInfo;

internal static class LastSessionInfoServices
{
    public static void AddLastSessionInfoFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ILastSessionInfoConfiguration, LastSessionInfoConfiguration>(LastSessionInfoConfiguration.FeatureName);
        services.AddSingleton<IFeatureEnablementProvider, LastSessionInfoFeatureEnablementProvider>();
    }
}
