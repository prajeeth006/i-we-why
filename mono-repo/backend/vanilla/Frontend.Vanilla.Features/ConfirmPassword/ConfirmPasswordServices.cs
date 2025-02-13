using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.ConfirmPassword;

internal static class ConfirmPasswordServices
{
    public static void AddConfirmPasswordFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IConfirmPasswordConfiguration, ConfirmPasswordConfiguration>(ConfirmPasswordConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, ConfirmPasswordClientConfigProvider>();
    }
}
