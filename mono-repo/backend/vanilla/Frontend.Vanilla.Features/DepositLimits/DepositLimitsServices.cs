using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.DepositLimits;

internal static class DepositLimitsServices
{
    public static void AddDepositLimitsFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IDepositLimitsConfiguration, DepositLimitsConfiguration>(DepositLimitsConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, DepositLimitsClientConfigProvider>();
        services.AddSingleton<IClientConfigProvider, DepositLimitExceededClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, DepositLimitExceededFeatureEnablementProvider>();
    }
}
