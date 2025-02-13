using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.RtmsEvents;

internal static class RtmsEventsServices
{
    public static void AddRtmsEventsFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IRtmsEventsConfiguration, RtmsEventsConfiguration>(RtmsEventsConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, RtmsEventsClientConfigProvider>();
    }
}
