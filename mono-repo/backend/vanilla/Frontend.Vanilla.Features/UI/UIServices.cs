using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.UI;

internal static class UiServices
{
    public static void AddUiFeatureBase(this IServiceCollection services)
    {
        services.AddConfiguration<IUserInterfaceConfiguration, UserInterfaceConfiguration>(UserInterfaceConfiguration.FeatureName);
    }

    public static void AddUiFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ILoadingIndicatorConfiguration, LoadingIndicatorConfiguration>(LoadingIndicatorConfiguration.FeatureName);
        services.AddConfiguration<IProfilingConfiguration, ProfilingConfiguration>(ProfilingConfiguration.FeatureName);
    }
}
