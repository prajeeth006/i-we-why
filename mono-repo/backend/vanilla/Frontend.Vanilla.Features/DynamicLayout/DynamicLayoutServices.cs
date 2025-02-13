using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.DynamicLayout;

internal static class DynamicLayoutServices
{
    public static void AddDynamicLayoutFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, DynamicLayoutClientConfigProvider>();
        services.AddConfiguration<IDynamicLayoutConfiguration, DynamicLayoutConfiguration>(DynamicLayoutConfiguration.FeatureName);
    }
}
