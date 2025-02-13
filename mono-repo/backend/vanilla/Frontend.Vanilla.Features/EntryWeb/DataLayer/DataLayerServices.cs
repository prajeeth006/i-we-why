using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.EntryWeb.DataLayer.TagManagers;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.EntryWeb.DataLayer;

internal static class DataLayerServices
{
    public static void AddDataLayerFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ITrackingConfiguration, TrackingConfiguration>(TrackingConfiguration.FeatureName);
        services.AddSingleton<ITagManager, GoogleTagManager>();
        services.AddSingleton<IDataLayerRenderer, DataLayerRenderer>();
    }

    public static void AddDataLayerFeatureSfapi(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, DataLayerTrackingClientConfigProvider>();
    }
}
