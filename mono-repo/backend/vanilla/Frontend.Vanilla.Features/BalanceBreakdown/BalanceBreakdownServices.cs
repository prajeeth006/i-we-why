using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.BalanceBreakdown;

internal static class BalanceBreakdownServices
{
    public static void AddBalanceBreakdownFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IBalanceBreakdownConfiguration, BalanceBreakdownConfiguration>(BalanceBreakdownConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, BalanceBreakdownClientConfigProvider>();
    }
}
