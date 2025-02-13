using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.RememberMe;

internal static class RememberMeServices
{
    public static void AddRememberMeFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IRememberMeConfiguration, RememberMeConfiguration>(RememberMeConfiguration.FeatureName);
        services.AddSingleton<IRememberMeTokenCookie, RememberMeTokenCookie>();
        services.AddSingleton<IClientConfigProvider, RememberMeClientConfigProvider>();
    }
}
