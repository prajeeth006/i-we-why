using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.SelfExclusion;

internal static class SelfExclusionServices
{
    public static void AddSelfExclusionFeature(this IServiceCollection services)
    {
        services.AddConfiguration<ISelfExclusionConfiguration, SelfExclusionConfiguration>(SelfExclusionConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, SelfExclusionClientConfigProvider>();
    }
}
