using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Cashier;

internal static class CashierServices
{
    public static void AddCashierFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ICashierConfiguration, CashierConfiguration>(CashierConfiguration.FeatureName);
    }

    public static void AddCashierFeatureSfapi(this IServiceCollection services)
    {
        services.AddSingleton<IClientConfigProvider, CashierClientConfigProvider>();
    }
}
