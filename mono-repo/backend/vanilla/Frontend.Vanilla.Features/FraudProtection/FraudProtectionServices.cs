using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.FraudProtection;

internal static class FraudProtectionServices
{
    public static void AddFraudProtectionFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ISeonConfiguration, SeonConfiguration>(SeonConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, SeonClientConfigProvider>();
    }
}
