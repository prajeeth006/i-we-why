using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.AccountUpgrade;

internal static class AccountUpgradeServices
{
    public static void AddAccountUpgradeFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IAccountUpgradeConfiguration, AccountUpgradeConfiguration>(AccountUpgradeConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, AccountUpgradeClientConfigProvider>();
    }
}
