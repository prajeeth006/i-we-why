using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.RtmsConnection;

internal static class RtmsConnectionServices
{
    public static void AddRtmsConnectionFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IRtmsConfiguration, RtmsConfiguration>(RtmsConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, RtmsClientConfigProvider>();
    }
}
