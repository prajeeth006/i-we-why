using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.DepositPrompt;

internal static class DepositPromptServices
{
    public static void AddDepositPromptFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IDepositPromptConfiguration, DepositPromptConfiguration>(DepositPromptConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, DepositPromptClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, DepositPromptFeatureEnablementProvider>();
    }
}
