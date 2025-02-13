using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.ScreenTime;

internal static class ScreenTimeServices
{
    public static void AddScreenTimeFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IScreenTimeConfiguration, ScreenTimeConfiguration>(ScreenTimeConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, ScreenTimeClientConfigProvider>();
    }
}
