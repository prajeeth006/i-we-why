using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Logout;

internal static class LogoutServices
{
    public static void AddLogoutFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ILogoutConfiguration, LogoutConfiguration>(LogoutConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, LogoutClientConfigProvider>();
    }
}
