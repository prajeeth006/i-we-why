using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.AccountMenu;

internal static class AccountMenuServices
{
    public static void AddAccountMenuFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IAccountMenuConfiguration, AccountMenuConfiguration>(AccountMenuConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, AccountMenuClientConfigProvider>();
    }
}
