using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.RtmsLayer;

internal static class RtmsServices
{
    public static void AddRtmsLayerFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IRtmsLayerConfiguration, RtmsLayerConfiguration>(RtmsLayerConfiguration.FeatureName);
        services.AddSingleton<INotificationContentProvider, NotificationContentProvider>();
        services.AddSingleton<IRtmsMessagesClientValuesProvider, RmtsMessagesClientValuesProvider>();
        services.AddSingleton<IClientConfigProvider, RtmsLayerClientConfigProvider>();
        services.AddSingleton<IBonusTeaserContentProvider, BonusTeaserContentProvider>();
    }
}
