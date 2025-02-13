using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.ActivityPopup;

internal static class ActivityPopupServices
{
    public static void AddActivityPopupFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, ActivityPopupClientConfigProvider>();
        services.AddConfiguration<IActivityPopupConfiguration, ActivityPopupConfiguration>(ActivityPopupConfiguration.FeatureName);
        services.AddSingleton<IFeatureEnablementProvider, ActivityPopupFeatureEnablementProvider>();
    }
}
