using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;

namespace Frontend.SharedFeatures.Api.Features.DepositSession;

internal static class DepositSessionServices
{
    public static void AddDepositSessionFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IDepositSessionConfiguration, DepositSessionConfiguration>(DepositSessionConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, DepositSessionClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, DepositSessionFeatureEnablementProvider>();
    }
}
