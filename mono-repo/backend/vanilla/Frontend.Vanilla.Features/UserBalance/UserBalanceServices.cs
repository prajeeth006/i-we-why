using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.UserBalance;

internal static class UserBalanceServices
{
    public static void AddUserBalanceFeatureBase(this IServiceCollection services)
    {
        services.AddConfiguration<IBalanceConfiguration, BalanceConfiguration>(BalanceConfiguration.FeatureName);
    }

    public static void AddUserBalanceFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, BalanceSettingsConfigProvider>();
    }
}
