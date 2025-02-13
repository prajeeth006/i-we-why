using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.RememberMeLogoutPrompt;

internal static class RememberMeLogoutPromptServices
{
    public static void AddRememberMeLogoutPromptFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IRememberMeLogoutPromptConfiguration, RememberMeLogoutPromptConfiguration>(RememberMeLogoutPromptConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, RememberMeLogoutPromptClientConfigProvider>();
        services.AddSingleton<IFeatureEnablementProvider, RememberMeLogoutPromptFeatureEnablementProvider>();
    }
}
