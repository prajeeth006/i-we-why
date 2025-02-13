using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.PlayBreak;

internal static class PlayBreakServices
{
    public static void AddPlayBreakFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IPlayBreakConfiguration, PlayBreakConfiguration>(PlayBreakConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, PlayBreakClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, PlayBreakFeatureEnablementProvider>();
    }
}
