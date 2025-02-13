using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Host.Features.ClientConfig;

internal static class ClientConfigServices
{
    public static void AddClientConfigFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IClientConfigConfiguration, ClientConfigConfiguration>(ClientConfigConfiguration.FeatureName);
        services.AddSingleton<IEagerClientConfigService, EagerClientConfigService>();
    }
}
